const accessKey = process.env.AWS_ACCESS_KEY_ID || 'YOUR_KEY';
const accessSecret = process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET';

import * as MwsApi from 'amazon-mws';

const amazonMws = new MwsApi();
amazonMws.setApiKey(accessKey, accessSecret);

const reportRequest = async () => {

    let response = await amazonMws.reports.search({
        'Version': '2009-01-01',
        'Action': 'GetReportList',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        //'ReportTypeList.Type.1': 'REPORT_TYPE_LIST' //optional
    }).catch(error => {
        if (error) {
            console.log('error', error);
        }
    });
    console.log('response', response);
};

reportRequest();