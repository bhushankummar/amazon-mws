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

        var rows = [];
        function processRowsInBatches(row, end, callback) {
            if (typeof end === 'undefined') {
                end = false;
            }
            if (row) {
                rows.push(row);
            }
            if (rows.length >= 5000 || (end && rows.length)) {
                sendToDB(rows.splice(0, 0), callback);
                rows = [];
            }
        }

        function sendToDB(data, callback) {
            // Send your data to the db
            console.log(data.length);
            callback();
        }

        var decodeStream = iconv.decodeStream('ISO-8859-1');
        response.pipe(decodeStream);
        var csvStream = csv.parse({
            delimiter: '\t',
            headers: true,
            discardUnmappedColumns: true,
            ignoreEmpty: true,
            trim: true
        });
        decodeStream.pipe(csvStream);
        csvStream.transform(function (data, cb) {
            processRowsInBatches(data, false, cb);
        });
        csvStream
            .on('error', function (error) { console.error(error); })
            .on('finish', function () {
                console.log('Finished proccessing stream');
                // Call processRowsInBatches to proccess remaining rows
                processRowsInBatches(undefined, true, function () {
                    console.log('Saved last rows in the db');
                });
            });
    });
};

reportRequest();