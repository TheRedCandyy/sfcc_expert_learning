'use strict';

var CustomerMgr = require("dw/customer/CustomerMgr");
var productListHelper = require('lib_productlist/cartridge/scripts/productList/productListHelpers');
var File = require('dw/io/File');
var FileWriter = require('dw/io/FileWriter');
var FileReader = require('dw/io/FileReader');
var Resource = require('dw/web/Resource');

module.exports = {
    exportWishlist: function exportWishlist() {
        var CUSTOMER_LIST_FILE_PATH = Resource.msg('wishlist.customerlist.full.file.path', 'wishlistJob', null);
        var EXPORT_FILE_PATH = Resource.msg('wishlist.export.full.file.path', 'wishlistJob', null);

        var MILLISECS_IN_A_DAY = 86400000;
        var CUSTOMER_UID_CSV_HEADER = 'customer uid';
        var PRODUCT_ID_CSV_HEADER = 'product id';
        var CUSTOMER_NAME_CSV_HEADER = 'customer name';
        var EMAIL_ADDRESS_CSV_HEADER = 'email address';
        var DATE_PRODUCT_CSV_HEADER = 'date product';

        var file = new File(File.IMPEX + CUSTOMER_LIST_FILE_PATH);
        var fileReader = new FileReader(file);
        var xmlFile = fileReader.readLines().toArray();
        var customerNumberList = [];

        //Gets the costumerIds from the customer export file
        xmlFile.forEach(function (xmlLine) {
            if (xmlLine.includes('customer-no')) {
                customerNumberList.push(xmlLine.substring(xmlLine.indexOf('"') + 1, xmlLine.length - 2).toString());
            }
        });

        fileReader.close();
        var file = new File(File.IMPEX + EXPORT_FILE_PATH);
        var fileWriter = new FileWriter(file);
        fileWriter.setLineSeparator('\r\n');
        fileWriter.writeLine(CUSTOMER_UID_CSV_HEADER + ',' + PRODUCT_ID_CSV_HEADER + ',' + CUSTOMER_NAME_CSV_HEADER + ',' + EMAIL_ADDRESS_CSV_HEADER + ',' + DATE_PRODUCT_CSV_HEADER);

        customerNumberList.forEach(function (customerId) {
            //Gets the customer by his number and gets his wishlist
            var customer = CustomerMgr.getCustomerByCustomerNumber(customerId.toString());
            var config = { type: 10 };
            var wishlist = productListHelper.getCurrentOrNewList(customer, config);

            var items = wishlist.getItems().toArray();
            if (items.length > 0) {
                items.forEach(function (item) {
                    if (Date.parse(item.creationDate) < (Date.now() - MILLISECS_IN_A_DAY)) {
                        //Writes the data into the file if the user has items on the wishlist and the items are older than a day
                        fileWriter.writeLine(customerId.toString() + ',' + item.ID + ',' + customer.profile.firstName + ' ' + customer.profile.lastName + ',' + customer.profile.email + ',' + item.creationDate);
                    }
                });
            }

        });
        fileWriter.close();
    }
};
