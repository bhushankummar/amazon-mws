'use strict';

var accessKey = process.env.AWS_ACCESS_KEY_ID || 'YOUR_KEY';
var accessSecret = process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET';

var amazonMws = require('../../../lib/amazon-mws')(accessKey, accessSecret);

var fulfillmentOutboundShipmentRequest = function () {

    amazonMws.fulfillmentOutboundShipment.create({
        'Version': '2010-10-01',
        'Action': 'CreateFulfillmentOrder',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'SellerFulfillmentOrderId': 'SELLER_FULFILLMENT_ORDER_ID',
        'ShippingSpeedCategory': 'SHIPPING_SPEED_CATEGORY',
        'DisplayableOrderId': 'DISPLAYABLE_ORDER_ID',
        'DisplayableOrderDateTime': 'DISPLAYABLE_ORDER_DATE_TIME',
        'DisplayableOrderComment': 'DISPLAYABLE_ORDER_COMMENT',
        'DestinationAddress.Name': 'NAME',
        'DestinationAddress.Line1': 'LINE_1',
        'DestinationAddress.Line2': 'LINE_2',
        'DestinationAddress.City': 'CITY',
        'DestinationAddress.StateOrProvinceCode': 'STATE_OR_PROVINCE_CODE',
        'DestinationAddress.PostalCode': 'POSTAL_CODE',
        'DestinationAddress.CountryCode': 'COUNTRY_CODE',
        'DestinationAddress.DistrictOrCounty': 'DISTRICT_OR_COUNTY',
        'DestinationAddress.PhoneNumber': 'PHONE_NUMBER',
        'Items.member.1.DisplayableComment': 'DISPLAYABLE_COMMENT',
        'Items.member.1.GiftMessage': 'GIFT_MESSAGE',
        'Items.member.1.PerUnitDeclaredValue.Value': 'VALUE',
        'Items.member.1.PerUnitDeclaredValue.CurrencyCode': 'CURRENCY_CODE',
        'Items.member.1.FulfillmentNetworkSKU': 'FULFILLMENT_NETWORK_SKU',
        'Items.member.1.Quantity': 'QUANTITY',
        'Items.member.1.SellerFulfillmentOrderItemId': 'SELLER_FULFILLMENT_ORDER_ITEM_ID',
        'Items.member.1.SellerSKU': 'SELLER_SKU',
        'MarketplaceId': 'MARKETPLACE_ID',
        'FulfillmentAction': 'FULFILLMENT_ACTION'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
};

fulfillmentOutboundShipmentRequest();