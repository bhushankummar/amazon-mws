'use strict';

var mwsAccount = require('../mwsAccount');
var amazonMws = require('../../../lib/amazon-mws')(mwsAccount.AccessKey, mwsAccount.AccessSecret);

var sellerRequest = function () {
    amazonMws.sellers.search({
        Version: '2011-07-01',
        Action: 'ListMarketplaceParticipations',
        SellerId: mwsAccount.SellerId,
        MWSAuthToken: mwsAccount.MWSAuthToken
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', JSON.stringify(response, null, 2));
    });
};

sellerRequest();
