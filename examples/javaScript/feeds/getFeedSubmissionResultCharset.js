'use strict';

var accessKey = process.env.AWS_ACCESS_KEY_ID || 'YOUR_KEY';
var accessSecret = process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET';

var amazonMws = require('../../../lib/amazon-mws')(accessKey, accessSecret);
var fse = require('fs-extra');

/**
 * Use __CHARSET__ to get the raw response in response->data;
 * This along with __RAW__ do not get written in the request.
 * */
function feedRequest() {
    var FeedSubmissionId = '10101010XXX';
    amazonMws.feeds.search({
        'Version': '2009-01-01',
        'Action': 'GetFeedSubmissionResult',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'FeedSubmissionId': FeedSubmissionId,
        __CHARSET__: 'UTF-8'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        fse.writeFileSync('response.txt', response.data);
        console.log('Headers', response.Headers);
    });
}

feedRequest();