'use strict';

var awsSellerAccount = require('../utils/account');
var amazonMws = require('../../../lib/amazon-mws')(awsSellerAccount.AccessKey, awsSellerAccount.AccessSecret);

var sellerRequest = function () {
    amazonMws.sellers.search({
        'Version': '2011-07-01',
        'Action': 'ListMarketplaceParticipations',
        'SellerId': awsSellerAccount.SellerId,
        'MWSAuthToken': awsSellerAccount.MWSAuthToken
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', JSON.stringify(response, null, 2));
    });
};

sellerRequest();