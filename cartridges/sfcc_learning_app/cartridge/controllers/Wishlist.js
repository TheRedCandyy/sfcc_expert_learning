'use strict';

/**
 * @namespace Wishlist
 */

 var server = require('server');
 var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
 var productListHelper = require('*/cartridge/scripts/productList/productListHelpers');
 var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
 var userLoggedIn = require('*/cartridge/scripts/middleware/userLoggedIn');
 
 var Resource = require('dw/web/Resource');
 var URLUtils = require('dw/web/URLUtils');
 var ProductList = require('dw/customer/ProductList');

/**
 * This endpoint is called when the user enter the wishlist page
 * in here the user can see all the items he has in his wishlist
 */
server.get('Show', consentTracking.consent, userLoggedIn.validateLoggedIn, server.middleware.https, csrfProtection.generateToken,
    function (req, res, next) {
        var list = productListHelper.getList(req.currentCustomer.raw, { type: 10 });
        var WishlistModel = require('*/cartridge/models/productList');

        var wishlistModel = new WishlistModel(
            list,
            {
                type: 'wishlist'
            }
        ).productList;

        res.render('/wishlist/wishlist', {
            wishlist: wishlistModel
        });
        next();
    }
);

server.post('AddProduct', function (req, res, next) {
    var list = productListHelper.getCurrentOrNewList(req.currentCustomer.raw, { type: 10 }); // Type 10 means it is a wishlist productList
    var pid = req.form.pid;
    var optionId = req.form.optionId || null;
    var optionVal = req.form.optionVal || null;

    var config = {
        qty: 1,
        optionId: optionId,
        optionValue: optionVal,
        req: req,
        type: 10
    };

    var errMsg = productListHelper.itemExists(list, pid, config) ? Resource.msg('wishlist.addtowishlist.exist.msg', 'wishlist', null) :
        Resource.msg('wishlist.addtowishlist.failure.msg', 'wishlist', null);

    var success = productListHelper.addItem(list, pid, config);

    if (success) {
        res.json({
            success: true,
            pid: pid,
            button: 'remove-from-wishlist',
            msg: Resource.msg('wishlist.addtowishlist.success.msg', 'wishlist', null)
        });
    } else {
        res.json({
            error: true,
            pid: pid,
            msg: Resource.msg('wishlist.addtowishlist.failure.msg', 'wishlist', null)
        });
    }

    next();
});

server.post('RemoveProduct', function (req, res, next) {
    var optionId = req.form.optionId || null;
    var optionVal = req.form.optionVal || null;

    var config = {
        qty: 1,
        optionId: optionId,
        optionValue: optionVal,
        req: req,
        type: 10
    };
    try {
        var list = productListHelper.removeItem(req.currentCustomer.raw, req.form.pid, config);
        var listIsEmpty = list.prodList.items.empty;

        res.json({
            success: true,
            listIsEmpty: listIsEmpty,
            msg: Resource.msg('wishlist.removefromwishlist.success.msg', 'wishlist', null)
        });
    } catch (e) {
        res.json({
            error: true,
            msg: Resource.msg('wishlist.removefromwishlist.failure.msg', 'wishlist', null)
        });
    }

    next();
});

module.exports = server.exports();
