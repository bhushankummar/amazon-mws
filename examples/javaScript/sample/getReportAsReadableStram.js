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
        async function processRowsInBatches(row, end = false) {
            if (row) {
                rows.push(data);
            }
            if (rows.length >= 5000 || (end && rows.length)) {
                await sendToDB([...rows]);
                rows = [];
            }
        }

        async function sendToDB(data) {
            // Send your data to the db
            console.log(data.length);
        }

        const decodeStream = iconv.decodeStream('ISO-8859-1');
        response.pipe(decodeStream);
        const csvStream = csv.parse({
            delimiter: '\t',
            headers: true,
            discardUnmappedColumns: true,
            ignoreEmpty: true,
            trim: true
        });
        decodeStream.pipe(csvStream);
        csvStream.transform(async (data, cb) => {
            await processRowsInBatches(data)
                .then(cb)
                .catch(cb);
        });
        csvStream
            .on('error', error => console.error(error))
            .on('finish', async () => {
                console.log('Finished proccessing stream');
                // Call processRowsInBatches to proccess remaining rows
                processRowsInBatches(undefined, true);
            });
    });
};

reportRequest();