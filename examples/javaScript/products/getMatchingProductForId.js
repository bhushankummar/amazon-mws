'use strict';

var accessKey = process.env.AWS_ACCESS_KEY_ID || 'YOUR_KEY';
var accessSecret = process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET';

var amazonMws = require('../../../lib/amazon-mws')(accessKey, accessSecret);

var productRequest = async function () {
    var mwsRequestData = {
        Version: '2011-10-01',
        Action: 'GetMatchingProductForId',
        SellerId: 'AEDO7KP6Y1XO',
        // MWSAuthToken: 'MWS_AUTH_TOKEN',
        MarketplaceId: 'ATVPDKIKX0DER',
        IdType: 'ASIN',
        'IdList.Id.1': 'B00S59NYT2',
        'IdList.Id.2': 'B01H5RLTLY'
    };
    try {
        var response = await amazonMws.products.search(mwsRequestData);
        console.log('response', response);
    } catch (error) {
        console.log('error products', error);
    }
};

productRequest();
