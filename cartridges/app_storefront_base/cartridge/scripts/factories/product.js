'use strict';

var ProductMgr = require('dw/catalog/ProductMgr');
var ProductTile = require('./../../models/product/productBase');
var Product = require('./../../models/product/product');

/**
 * Factory utility that returns a ProductModel instance that encapsulates a Demandware Product
 * instance.
 */
function ProductFactory() {}

ProductFactory.get = function (params) {
    var productId = params.pid;
    var apiProduct = ProductMgr.getProduct(productId);

    var variationModel = Product.getVariationModel(apiProduct, params.variables);

    var product = variationModel.getSelectedVariant() || apiProduct;

    var productType = Product.getProductType(product);

    if (productType === 'variant' || productType === 'master' || productType === 'variationGroup') {
        product = params.pview
            ? new ProductTile(apiProduct, params.variables)
            : new Product(apiProduct, params.variables, params.quantity);
    } else if (productType === 'set') {
        // TODO: Add ProductSet factory
    } else if (productType === 'bundle') {
        // TODO: Add ProductBundle factory
    } else {
        throw new TypeError('Invalid Product Type');
    }

    return product;
};

module.exports = ProductFactory;