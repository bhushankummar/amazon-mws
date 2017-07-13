'use strict';

var accessKey = process.env.AWS_ACCESS_KEY_ID || 'YOUR_KEY';
var accessSecret = process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET';

var amazonAWS = require('../../lib/amazon-mws')(accessKey, accessSecret);

var sellerRequest = function () {

    amazonAWS.sellers.listMarketplaceParticipations({
        'Action': 'ListMarketplaceParticipations',
        'SellerId': 'AUV38W4NKU8JH',
        'MWSAuthToken': 'amzn.mws.06ad6265-74e6-cdea-f3da-2541b634587d'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
};

sellerRequest();