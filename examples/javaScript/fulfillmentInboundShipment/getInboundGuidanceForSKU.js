'use strict';

var accessKey = process.env.AWS_ACCESS_KEY_ID || 'YOUR_KEY';
var accessSecret = process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET';

var amazonMws = require('../../../lib/amazon-mws')(accessKey, accessSecret);

var fulfillmentInboundShipmentRequest = function () {

    amazonMws.fulfillmentInboundShipment.search({
        'Version': '2010-10-01',
        'Action': 'GetInboundGuidanceForSKU',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'MarketplaceId': 'MARKET_PLACE_ID',
        'SellerSKUList.Id.1': 'us001'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
};

fulfillmentInboundShipmentRequest();