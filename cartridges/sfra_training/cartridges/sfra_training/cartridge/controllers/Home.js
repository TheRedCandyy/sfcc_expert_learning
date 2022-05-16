'use strict';

/**
 * @namespace Home
 */

var server = require('server');
var cache = require('../scripts/middleware/cache');

/**
 * Any customization on this endpoint, also requires update for Default-Start endpoint
 */
/**
 * Home-Show : This endpoint is called when a shopper navigates to the home page
 * @name Base/Home-Show
 * @function
 * @memberof Home
 * @param {middleware} - consentTracking.consent
 * @param {middleware} - cache.applyDefaultCache
 * @param {category} - non-sensitive
 * @param {renders} - isml
 * @param {serverfunction} - get
 */
server.extend(module.superModule);
server.prepend('Show', cache.applyDefaultCache, function (req, res, next) {
    var viewData = res.getViewData();
    viewData.param1 = 'This is from prepend';
    res.setViewData(viewData);
    next();
});

server.append('Show', cache.applyCustomCache, function (req, res, next) {
    var viewData = res.getViewData();
    var appendParam = 'This is from append';
    var queryparam = req.querystring.param ? req.querystring.param : 'no parameter was passed';
    res.setViewData({
        param1: viewData.param1 + ' AND ' + appendParam + ' AND querystring param = ' + queryparam,
        param2: res.cachePeriod + ' ' + res.cachePeriodUnit
    });
    next();
});

module.exports = server.exports();
