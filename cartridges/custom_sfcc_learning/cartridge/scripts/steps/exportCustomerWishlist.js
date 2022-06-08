'use strict';

var CustomerMgr = require("dw/customer/CustomerMgr");
var productListHelper = require('lib_productlist/cartridge/scripts/productList/productListHelpers');
var File = require('dw/io/File');
var FileWriter = require('dw/io/FileWriter');
var FileReader = require('dw/io/FileReader');

module.exports = {
    exportWishlist: function exportWishlist() {
        // Read customer list
        // Do my logic
        // Delete old customer list file
        // Write new file with the data needed

        var file = new File(File.IMPEX + '/src/CustomerList.xml');

        var fileReader = new FileReader(file);

        var xmlFile = fileReader.readLines().toArray();

        var customerIdList = [];

        xmlFile.forEach(function (xmlLine) {
            if (xmlLine.includes('customer-no')) {
                customerIdList.push(xmlLine.substring(xmlLine.indexOf('"') + 1, xmlLine.length - 2).toString());
            }
        });

        fileReader.close();
        var file = new File('IMPEX/src/testing.csv');
        var fileWriter = new FileWriter(file);
        fileWriter.setLineSeparator('\r\n');
        fileWriter.writeLine('customer uid,product id,customer name,email address,date product');

        customerIdList.forEach(function (customerId) {
            var customer = CustomerMgr.getCustomerByCustomerNumber(customerId.toString());
            var config = { type: 10 };
            var wishlist = productListHelper.getCurrentOrNewList(customer, config);

            var items = wishlist.getItems().toArray();
            if (items.length > 0) {
                items.forEach(function (item) {
                    if (Date.parse(item.creationDate) < (Date.now() - 86400000)) {
                        fileWriter.writeLine(customerId.toString() + ',' + item.ID + ',' + customer.profile.firstName + ' ' + customer.profile.lastName + ',' + customer.profile.email + ',' + item.creationDate);
                    }
                });
            }

        });
        fileWriter.close();
    }
};
