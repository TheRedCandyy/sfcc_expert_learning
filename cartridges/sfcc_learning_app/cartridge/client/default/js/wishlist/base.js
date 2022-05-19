'use strict';

$('#successModal').on('hide.bs.modal', function (e) {
    window.location.reload();
})

 function getPidValueWishlist($el) {
    var pid;

    if ($('#quickViewModal').hasClass('show') && !$('.product-set').length) {
        pid = $($el).closest('.modal-content').find('.product-quickview').data('pid');
    } else if ($('.product-set-detail').length || $('.product-set').length) {
        pid = $($el).closest('.product-detail').find('.product-id').text();
    } else {
        pid = $('.product-detail:not(".bundle-item")').data('pid');
    }
    return pid;
}

function displayMessage(data, button) {
    if(data.success){
        $('.wishlist-text').addClass('text-success');
        $('.wishlist-text').html(data.msg);
        if (data.button === 'remove-from-wishlist') {
            $('.remove-from-wishlist[data-pid='+ data.pid +']').show();
            $('.add-to-wishlist[data-pid='+ data.pid +']').hide();
        }else{
            $('.remove-from-wishlist[data-pid='+ data.pid +']').hide();
            $('.add-to-wishlist[data-pid='+ data.pid +']').show();
        }
    }else {
        $('.wishlist-text').addClass('text-danger');
        $('.wishlist-text').html(data.msg);
        console.log(data.error);
    }

    if (button.hasClass('wishlist-page')) {
        window.location.reload();
        return false;
    }

    $.spinner().stop();
    button.removeAttr('disabled');
}

module.exports = {
    addToWishlist: function () {
        $(document).on('click', 'button.add-to-wishlist', function (e) {
            e.preventDefault();
            var button = $(this);
            var url = button.attr('data-href');
            var pid = getPidValueWishlist($(this));
            var optionId = button.closest('.product-detail').find('.select-size').attr('id');
            var optionVal = button.closest('.product-detail').find('.select-size option:selected').attr('data-attr-value');

            $.spinner().start();
            button.attr('disabled', true);
            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json',
                data: {
                    pid,
                    optionId,
                    optionVal
                },
                success: function (data) {
                    displayMessage(data, button);
                },
                error: function (err) {
                    displayMessage(err, button);
                }
            });
        });
    },
    removeFromWishlist: function () {
        $(document).on('click', 'button.remove-from-wishlist', function (e) {
            e.preventDefault();
            var button = $(this);
            var url = button.attr('data-href');
            var pid = button.attr('data-pid');
            var optionId = button.closest('.product-detail').find('.select-size').attr('id');
            var optionVal = button.closest('.product-detail').find('.select-size option:selected').attr('data-attr-value');

            $.spinner().start();
            button.attr('disabled', true);
            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json',
                data: {
                    pid,
                    optionId,
                    optionVal
                },
                success: function (data) {
                    displayMessage(data, button);
                },
                error: function (err) {
                    displayMessage(err, button);
                }
            });
        });
    },
    addToCartFromWishlist: function () {
        $(document).on('click', 'button.add-to-cart.wishlist-page', function () {
            var pid;
            var addToCartUrl;
            var pidsQty;

            $('body').trigger('product:beforeAddToCart', this);

            pid = $(this).data('pid');
            addToCartUrl = $(this).data('href');
            pidsQty = 1;

            var form = {
                pid: pid,
                quantity: pidsQty
            };

            if ($(this).data('option')) {
                form.options = JSON.stringify($(this).data('option'));
            }

            if (addToCartUrl) {
                $.ajax({
                    url: addToCartUrl,
                    method: 'POST',
                    data: form,
                    success: function (data) {
                        $('#successModal').modal('show');
                        $.spinner().stop();
                    },
                    error: function () {
                        $.spinner().stop();
                    }
                });
            }
        });
    }
};