'use strict';

var mwsAccount = require('../mwsAccount');
var amazonMws = require('../../../lib/amazon-mws')(mwsAccount.accessKey, mwsAccount.accessSecret);

var productRequest = async function () {
    var ASINList = ['ASIN.1', 'ASIN.2'];
    var mwsRequestData = {
        Version: '2011-10-01',
        Action: 'GetLowestOfferListingsForASIN',
        SellerId: mwsAccount.sellerId,
        MarketplaceId: mwsAccount.marketplaceId,
        ItemCondition: 'New'
    };
    try {
        var index = 1;
        for (var i in ASINList) {
            mwsRequestData[ 'ASINList.ASIN.' + index ] = ASINList[ i ];
            index++;
        }
        var response = await amazonMws.products.searchFor(mwsRequestData);
        console.log('response ', response);
    } catch (error) {
        console.log('error products', error);
    }
};

productRequest();
