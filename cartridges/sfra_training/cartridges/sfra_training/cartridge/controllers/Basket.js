'use strict';

var server = require('server');

server.get('Show', function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var CartModel = require('*/cartridge/models/cart');
    var basketModel = new CartModel(BasketMgr.currentBasket);
    res.render('basket', basketModel);
    next();
});

module.exports = server.exports();
