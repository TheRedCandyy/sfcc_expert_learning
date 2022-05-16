'use strict';

var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');

server.get('Start', cache.applyDefaultCache, function (req, res, next) {
    var Site = require('dw/system/Site');
    res.render('helloWorld', { param1: Site.current.name });
    next();
});

module.exports = server.exports();
