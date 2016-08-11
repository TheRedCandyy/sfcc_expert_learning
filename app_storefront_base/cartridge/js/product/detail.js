'use strict';

/**
 * Process the attribute values for an attribute that has image swatches
 *
 * @param {Object} attr - Attribute
 * @param {String} attr.attributeID - Attribute ID
 * @param {Object[]} attr.values - Array of attribute value objects
 * @param {String} attr.values.value - Attribute coded value
 * @param {String} attr.values.url - URL to de/select an attribute value of the product
 * @param {boolean} attr.values.isSelectable - Flag as to whether an attribute value can be
 *     selected.  If there is no variant that corresponds to a specific combination of attribute
 *     values, an attribute may be disabled in the Product Detail Page
 */
function processSwatchValues(attr) {
    attr.values.forEach(function (attrValue) {
        var $attrValue = $('[data-attr="' + attr.attributeID + '"] [data-attr-value="' +
            attrValue.value + '"]');
        var $swatchAnchor = $attrValue.parent();

        $attrValue.attr('data-selected', attrValue.isSelected);

        if (attrValue.url) {
            $swatchAnchor.attr('href', attrValue.url);
        } else {
            $swatchAnchor.removeAttr('href');
        }

        // Disable if not selectable
        $attrValue.removeClass('selectable unselectable');

        $attrValue.addClass(attrValue.isSelectable ? 'selectable' : 'unselectable');
    });
}

/**
 * Process attribute values associated with an attribute that does not have image swatches
 *
 * @param {Object} attr - Attribute
 * @param {String} attr.attributeID - Attribute ID
 * @param {Object[]} attr.values - Array of attribute value objects
 * @param {String} attr.values.value - Attribute coded value
 * @param {String} attr.values.url - URL to de/select an attribute value of the product
 * @param {boolean} attr.values.isSelectable - Flag as to whether an attribute value can be
 *     selected.  If there is no variant that corresponds to a specific combination of attribute
 *     values, an attribute may be disabled in the Product Detail Page
 */
function processNonSwatchValues(attr) {
    attr.values.forEach(function (attrValue) {
        var $attr = '[data-attr="' + attr.attributeID + '"]';
        var $attrValue = $($attr + ' [data-attr-value="' + attrValue.value + '"]');
        $attrValue.attr('value', attrValue.url)
            .removeAttr('disabled');

        if (!attrValue.isSelectable) {
            $attrValue.attr('disabled', true);
        }
    });
}

/**
 * Routes the handling of attribute processing depending on whether the attribute has image
 *     swatches or not
 *
 * @param {Object} attrs - Attribute
 * @param {String} attr.attributeID - Attribute ID
 */
function updateAttrs(attrs) {
    // Currently, the only attribute type that has image swatches is Color.
    var attrsWithSwatches = ['color'];

    attrs.forEach(function (attr) {
        if (attrsWithSwatches.indexOf(attr.attributeID) > -1) {
            processSwatchValues(attr);
        } else {
            processNonSwatchValues(attr);
        }
    });
}

/**
 * Updates the availability status in the Product Detail Page
 *
 * @param {Object} response - Ajax response object after an attribute value has been [de]selected
 */
function updateAvailability(response) {
    var resources = {
        instock: response.resources.label_instock,
        allnotavailable: response.resources.label_allnotavailable,
        selectforstock: response.resources.info_selectforstock
    };
    var hasRequiredAttrsSelected = response.product.hasRequiredAttrsSelected;
    var isAvailable = response.product.isAvailable;
    var availabilityValue;

    if (hasRequiredAttrsSelected && isAvailable) {
        availabilityValue = resources.instock;
    } else if (hasRequiredAttrsSelected && !isAvailable) {
        availabilityValue = resources.allnotavailable;
    } else {
        availabilityValue = resources.selectforstock;
    }

    $('.availability-msg').empty().text(availabilityValue);
}

/**
 * Parses JSON from Ajax call made whenever an attribute value is [de]selected
 * @param {Object} response - response from Ajax call
 * @param {Object} response.product - Product object
 * @param {String} response.product.id - Product ID
 * @param {Object[]} response.product.attributes - Product attributes
 * @param {Object[]} response.product.images - Product images
 * @param {boolean} response.product.hasRequiredAttrsSelected - Flag as to whether all required
 *     attributes have been selected.  Used partially to determine whether the Add to Cart button
 *     can be enabled
 */
function parseJsonResponse(response) {
    // Update Item No.
    $('#product_id').text(response.product.id);

    updateAttrs(response.product.attributes);

    // REMOVEME (After RAP-5073 is completed): Just for dev testing to see JSON response object in
    //     page
    $('#response_object').text(JSON.stringify(response.product, null, 4));

    // Enable "Add to Cart" button if all required attributes have been selected
    $('#btn_add_to_cart').attr('disabled', !response.product.hasRequiredAttrsSelected);

    // Update primary images
    var primaryImageUrls = response.product.images;
    primaryImageUrls.large.forEach(function (imageUrl, idx) {
        $('#primary_images').find('img').eq(idx)
            .attr('src', imageUrl.url);
    });

    updateAvailability(response);
}

/**
 * Updates the Mini-Cart quantity value after the customer has pressed the "Add to Cart" button
 *
 * @param {String} response
 */
function handlePostCartAdd(response) {
    $('.mini-cart').empty().html(response);
}

/**
 * Retrieves the value associated with the Quantity pull-down menu
 */
function getQuantitySelected() {
    return $('select[name="quantity"]').val();
}

/**
 * Appends the quantity selected to the Ajax URL.  Used to determine product availability, which is
 * one criteria used to enable the "Add to Cart" button
 *
 * @param {String} url - Attribute value onClick URL used to [de]select an attribute value
 * @return {String} - The provided URL appended with the quantity selected in the query params or
 *     the original provided URL if no quantity selected
 */
function appendQuantityToUrl(url) {
    var quantitySelected = getQuantitySelected();

    return !quantitySelected ? url : url + '&quantity=' + quantitySelected;
}

module.exports = function () {
    $('select[name*="select_"]').on('change', function (e) {
        var selectedValueUrl = e.currentTarget.value;
        selectedValueUrl = appendQuantityToUrl(selectedValueUrl);

        $.ajax({
            url: selectedValueUrl,
            method: 'GET',
            success: parseJsonResponse
        });
    });


    $('[data-attr="color"] a').on('click', function (e) {
        var selectedValueUrl;
        e.preventDefault();
        selectedValueUrl = e.currentTarget.href;
        selectedValueUrl = appendQuantityToUrl(selectedValueUrl);

        $.ajax({
            url: selectedValueUrl,
            method: 'GET',
            success: parseJsonResponse
        });
    });

    $('#btn_add_to_cart').on('click', function () {
        var pid = $('#product_id').text();
        var quantity = getQuantitySelected();
        var queryParams = ['pid=' + pid, 'quantity=' + quantity].join('&');
        var addToCartUrl = $('input[name="addToCartUrl"]').val() + '?' + queryParams;

        if (addToCartUrl) {
            $.ajax({
                url: addToCartUrl,
                method: 'POST',
                success: handlePostCartAdd
            });
        }
    });
};
