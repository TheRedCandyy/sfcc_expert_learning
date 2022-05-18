'use strict';

function displayMessage(data, button) {
    $.spinner().stop();

    if(data.success){
        $('.wishlist-text').addClass('text-success');
        $('.wishlist-text').html(data.msg);
        if (data.button === 'remove-from-wishlist') {
            $('.remove-from-wishlist').show();
            $('.add-to-wishlist').hide();
        }else{
            $('.remove-from-wishlist').hide();
            $('.add-to-wishlist').show();
        }
    }else {
        $('.wishlist-text').addClass('text-danger');
        $('.wishlist-text').html(data.msg);
        console.log(data.error);
    }

    button.removeAttr('disabled');
}

module.exports = {
    addToWishlist: function () {
        $(document).on('click', 'button.add-to-wishlist', function (e) {
            e.preventDefault();
            var url = $(this).attr('data-href');
            var pid = $(this).attr('data-pid');
            var optionId = $(this).closest('.product-detail').find('.select-size').attr('id');
            var optionVal = $(this).closest('.product-detail').find('.select-size option:selected').attr('data-attr-value');
            var button = $(this);

            $.spinner().start();
            $(this).attr('disabled', true);
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
            var url = $(this).attr('data-href');
            var pid = $(this).attr('data-pid');
            var optionId = $(this).closest('.product-detail').find('.select-size').attr('id');
            var optionVal = $(this).closest('.product-detail').find('.select-size option:selected').attr('data-attr-value');
            var button = $(this);

            $.spinner().start();
            $(this).attr('disabled', true);
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