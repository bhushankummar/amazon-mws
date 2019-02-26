'use strict';

var accessKey = process.env.AWS_ACCESS_KEY_ID || 'YOUR_KEY';
var accessSecret = process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET';

var amazonMws = require('../../../lib/amazon-mws')(accessKey, accessSecret);

var productRequest = function () {
    amazonMws.products.search({
        'Version': '2011-10-01',
        'Action': 'GetMyFeesEstimate',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'FeesEstimateRequestList.FeesEstimateRequest.1.MarketplaceId': 'MARKET_PLACE_ID',
        'FeesEstimateRequestList.FeesEstimateRequest.1.IdType': 'ASIN',
        'FeesEstimateRequestList.FeesEstimateRequest.1.IdValue': 'ASIN',
        'FeesEstimateRequestList.FeesEstimateRequest.1.IsAmazonFulfilled': 'true',
        'FeesEstimateRequestList.FeesEstimateRequest.1.Identifier': 'Hello',
        'FeesEstimateRequestList.FeesEstimateRequest.1.PriceToEstimateFees.ListingPrice.CurrencyCode': 'USD',
        'FeesEstimateRequestList.FeesEstimateRequest.1.PriceToEstimateFees.ListingPrice.Amount': '30.00',
        'FeesEstimateRequestList.FeesEstimateRequest.1.PriceToEstimateFees.Shipping.CurrencyCode': 'USD',
        'FeesEstimateRequestList.FeesEstimateRequest.1.PriceToEstimateFees.Shipping.Amount': '3.99',
        'FeesEstimateRequestList.FeesEstimateRequest.1.PriceToEstimateFees.Points.PointsNumber': '0'
    }, function (error, response) {
        if (error) {
            console.log('error products', error);
            return;
        }
        console.log('response ', response);
    });
};

productRequest();