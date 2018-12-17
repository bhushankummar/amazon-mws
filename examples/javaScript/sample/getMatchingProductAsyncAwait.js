'use strict';

var accessKey = process.env.AWS_ACCESS_KEY_ID || 'YOUR_KEY';
var accessSecret = process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET';

var amazonMws = require('../../../lib/amazon-mws')(accessKey, accessSecret);

var productRequest = async function () {
    try {
        var response = await amazonMws.products.search({
            'Version': '2011-10-01',
            'Action': 'GetMatchingProduct',
            'SellerId': 'SELLER_ID',
            'MWSAuthToken': 'MWS_AUTH_TOKEN',
            'MarketplaceId': 'MARKET_PLACE_ID',
            'ASINList.ASIN.1': 'ASIN_1'
        });
        console.log('response', response);
    } catch (error) {
        console.log('error products', error);
    }
};

productRequest();