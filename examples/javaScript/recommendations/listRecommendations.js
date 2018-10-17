'use strict';

var accessKey = process.env.AWS_ACCESS_KEY_ID || 'YOUR_KEY';
var accessSecret = process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET';

var amazonMws = require('../../../lib/amazon-mws')(accessKey, accessSecret);

/**
 * If the response is empty than it means their is no recommendation.
 */
var recommendationRequest = function () {
    amazonMws.recommendations.searchFor({
        'Version': '2013-04-01',
        'Action': 'ListRecommendations',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'MarketplaceId': 'MARKET_PLACE_ID',
        'CategoryQueryList.CategoryQuery.1.FilterOptions.FilterOption.1': 'QualitySet=Defect',
        'CategoryQueryList.CategoryQuery.1.FilterOptions.FilterOption.2': 'ListingStatus=Active',
        'CategoryQueryList.CategoryQuery.1.RecommendationCategory': 'ListingQuality'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
};

recommendationRequest();