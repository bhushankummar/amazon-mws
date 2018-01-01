'use strict';

var accessKey = process.env.AWS_ACCESS_KEY_ID || 'YOUR_KEY';
var accessSecret = process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET';

var amazonMws = require('../../../lib/amazon-mws')(accessKey, accessSecret);

var productRequest = function () {

    var ASINList = ['ASIN.1', 'ASIN.2'];
    var data = {
        'Version': '2011-10-01',
        'Action': 'GetMatchingProduct',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'MarketplaceId': 'MARKET_PLACE_ID'
    };
    var index = 1;
    for (var i in ASINList) {
        data['ASINList.ASIN.' + index] = ASINList[i];
        index++;
    }
    amazonMws.products.search(data, function (error, response) {
        if (error) {
            console.log('error products', error);
            return;
        }
        //console.log('response ', JSON.stringify(response));
        console.log('response', response);
    });
};

productRequest();