'use strict';

var accessKey = process.env.AWS_ACCESS_KEY_ID || 'YOUR_KEY';
var accessSecret = process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET';

var amazonMws = require('../../../lib/amazon-mws')(accessKey, accessSecret);

var subscriptionRequest = function () {
    amazonMws.subscriptions.create({
        'Version': '2013-07-01',
        'Action': 'CreateSubscription',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'MarketplaceId': 'MARKET_PLACE_ID',
        'Subscription.Destination.AttributeList.member.1.Key': 'DESTINATION_KEY',
        'Subscription.Destination.AttributeList.member.1.Value': 'DESTINATION_VALUE',
        'Subscription.Destination.DeliveryChannel': 'DESTINATION_CHANNEL',
        'Subscription.IsEnabled': 'true',
        'Subscription.NotificationType': 'AnyOfferChanged'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
};

subscriptionRequest();