'use strict';

/**
 * @namespace Product
 */

var server = require('server');

var cache = require('*/cartridge/scripts/middleware/cache');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var pageMetaData = require('*/cartridge/scripts/middleware/pageMetaData');

server.extend(module.superModule);
server.prepend('Show',
    cache.applyPromotionSensitiveCache,
    consentTracking.consent,
    function (req, res, next) {
        var viewData = res.getViewData();
        viewData.loggedIn = req.currentCustomer.profile ? req.currentCustomer.profile.firstName : null;
        res.setViewData(viewData);
        next();
    }, pageMetaData.computedPageMetaData);

module.exports = server.exports();
