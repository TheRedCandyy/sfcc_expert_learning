'use strict';

module.exports = function (object, apiProduct) {
    Object.defineProperty(object, 'availableForAddToWishlist', {
        enumerable: true,
        value: apiProduct.custom.availableForAddToWishlist
    });
};
