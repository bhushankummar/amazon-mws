'use strict';

var accessKey = process.env.AWS_ACCESS_KEY_ID || 'YOUR_KEY';
var accessSecret = process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET';

var amazonMws = require('../../../lib/amazon-mws')(accessKey, accessSecret);

var reportRequest = function () {
    var ReportRequestId = '10101010XXX';
    amazonMws.reports.search({
        'Version': '2009-01-01',
        'Action': 'GetReportRequestList',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'ReportRequestIdList.Id.1': ReportRequestId
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
};

reportRequest();