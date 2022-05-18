'use strict';

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
    }
};