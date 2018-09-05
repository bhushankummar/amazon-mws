'use strict';

var accessKey = process.env.AWS_ACCESS_KEY_ID || 'YOUR_KEY';
var accessSecret = process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET';

var amazonMws = require('../../../lib/amazon-mws')(accessKey, accessSecret);

/**
 * This example has been written to override/set the default options before making the request.
 */

var orderRequest = function () {
    amazonMws.setApiKey(accessKey, accessSecret);
    amazonMws.setHost('YOUR HOST');

    // amazonMws.setHost('YOUR HOST', 443); // Alternate way
    // amazonMws.setHost('YOUR HOST', 443, 'https'); // Alternate way

    amazonMws.orders.search({
        'Version': '2013-09-01',
        'Action': 'ListOrders',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'MarketplaceId.Id.1': 'MARKET_PLEACE_ID_1',
        'LastUpdatedAfter': new Date(2016, 11, 24)
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
};

orderRequest();