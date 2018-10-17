'use strict';

var accessKey = process.env.AWS_ACCESS_KEY_ID || 'YOUR_KEY';
var accessSecret = process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET';

var amazonMws = require('../../../lib/amazon-mws')(accessKey, accessSecret);

var subscriptionRequest = function () {
    amazonMws.subscriptions.remove({
        'Version': '2013-07-01',
        'Action': 'DeleteSubscription',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'MarketplaceId': 'MARKET_PLACE_ID',
        'Destination.AttributeList.member.1.Key': 'DESTINATION_KEY',
        'Destination.AttributeList.member.1.Value': 'DESTINATION_VALUE',
        'Destination.DeliveryChannel': 'DESTINATION_CHANNEL',
        'NotificationType': 'AnyOfferChanged'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
};

subscriptionRequest();