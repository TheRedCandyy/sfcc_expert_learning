'use strict';

/**
 * @namespace Product
 */

var server = require('server');

var cache = require('*/cartridge/scripts/middleware/cache');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var pageMetaData = require('*/cartridge/scripts/middleware/pageMetaData');
var productListHelper = require('*/cartridge/scripts/productList/productListHelpers');

server.extend(module.superModule);
server.append('Show',
    cache.applyPromotionSensitiveCache,
    consentTracking.consent,
    function (req, res, next) {
        var viewData = res.getViewData();
        var ProductMgr = require('dw/catalog/ProductMgr');

        var list = productListHelper.getCurrentOrNewList(req.currentCustomer.raw, { type: 10 }); // Type 10 means it is a wishlist productList
        var pid = req.querystring.pid;

        var product = ProductMgr.getProduct(pid);

        var optionId = req.form.optionId || null;
        var optionVal = req.form.optionVal || null;

        var config = {
            qty: 1,
            optionId: optionId,
            optionValue: optionVal,
            req: req,
            type: 10
        };

        viewData.loggedIn = req.currentCustomer.profile ? req.currentCustomer.profile.firstName : null;
        viewData.inWishlist = !!productListHelper.itemExists(list, pid, config);
        viewData.availableForAddToWishlist = product.custom.availableForAddToWishlist;

        res.setViewData(viewData);
        next();
    }, pageMetaData.computedPageMetaData);

module.exports = server.exports();
