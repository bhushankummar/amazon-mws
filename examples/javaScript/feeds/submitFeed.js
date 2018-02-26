'use strict';

var accessKey = process.env.AWS_ACCESS_KEY_ID || 'YOUR_KEY';
var accessSecret = process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET';

var amazonMws = require('../../../lib/amazon-mws')(accessKey, accessSecret);
var fse = require('fs-extra');

var feedRequest = function () {

    var FeedContent = fse.readFileSync('./file.txt', 'UTF-8');
    console.log('FeedContent ', FeedContent);

    amazonMws.feeds.submit({
        'Version': '2009-01-01',
        'Action': 'SubmitFeed',
        'FeedType': '_POST_PRODUCT_DATA_',
        'FeedContent': FeedContent,
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
};

feedRequest();