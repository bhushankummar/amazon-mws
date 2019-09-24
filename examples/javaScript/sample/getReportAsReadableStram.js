'use strict';

var accessKey = process.env.AWS_ACCESS_KEY_ID || 'YOUR_KEY';
var accessSecret = process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET';

var amazonMws = require('../../../lib/amazon-mws')(accessKey, accessSecret);

var csv = require('fast-csv');
var iconv = require('iconv-lite');

var reportRequest = function () {
    /**
     * This will not provide you Throttling details in Header.
     * Amazon MWS itself not providing Throttling detail in GetReport call.
     */
    amazonMws.setHost('YOUR HOST');
    amazonMws.reports.search({
        'Version': '2009-01-01',
        'Action': 'GetReport',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'ReportId': 'REPORT_ID',
        '__STREAM__': true
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }

        let rows = [];
        function procesRowsInBatches(row, end = false) {
            if (row) {
                rows.push(data);
            }
            if (rows.length > 5000 || end) {
                sendToDB([...rows]);
                rows = [];
            }
        }

        function sendToDB(data) {
            console.log(data.length);
        }

        response
            .pipe(iconv.decodeStream('ISO-8859-1'))
            .pipe(
                csv.parse({
                    delimiter: '\t',
                    headers: true,
                    discardUnmappedColumns: true,
                    quote: null,
                    ignoreEmpty: true,
                    trim: true
                })
            )
            .on('data', row => {
                procesRowsInBatches(row);
            })
            .on('error', error => console.error(error))
            .on('end', rowCount => {
                console.log(`Processed ${rowCount} rows`);
                procesRowsInBatches(undefined, true);
            });
    });
};

reportRequest();