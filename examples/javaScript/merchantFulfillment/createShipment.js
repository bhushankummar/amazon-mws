'use strict';

var accessKey = process.env.AWS_ACCESS_KEY_ID || 'YOUR_KEY';
var accessSecret = process.env.AWS_SECRET_ACCESS_KEY || 'YOUR_SECRET';

var amazonMws = require('../../../lib/amazon-mws')(accessKey, accessSecret);

var merchantFulfillmentRequest = function () {

    amazonMws.merchantFulfillment.create({
        'Version': '2015-06-01',
        'Action': 'CreateShipment',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'ShippingServiceId': 'SHIPPING_SERVICE_ID',
        'ShipmentRequestDetails.AmazonOrderId': 'AMAZON_ORDER_ID',
        'ShipmentRequestDetails.PackageDimensions.Length': 'PACKAGE_LENGTH',
        'ShipmentRequestDetails.PackageDimensions.Width': 'PACKAGE_WIDTH',
        'ShipmentRequestDetails.PackageDimensions.Height': 'PACKAGE_HEIGHT',
        'ShipmentRequestDetails.PackageDimensions.Unit': 'PACKAGE_UNIT',
        'ShipmentRequestDetails.Weight.Value': 'WEIGHT_VALUE',
        'ShipmentRequestDetails.Weight.Unit': 'WEIGHT_UNIT',
        'ShipmentRequestDetails.ShipFromAddress.Name': 'SHIP_FROM_ADDRESS_NAME',
        'ShipmentRequestDetails.ShipFromAddress.AddressLine1': 'SHIP_FROM_ADDRESS_LINE_1',
        'ShipmentRequestDetails.ShipFromAddress.City': 'SHIP_FROM_ADDRESS_CITY',
        'ShipmentRequestDetails.ShipFromAddress.StateOrProvinceCode': 'SHIP_FROM_ADDRESS_STATE_OR_PROVINCE_CODE',
        'ShipmentRequestDetails.ShipFromAddress.PostalCode': 'SHIP_FROM_ADDRESS_POSTAL_CODE',
        'ShipmentRequestDetails.ShipFromAddress.CountryCode': 'SHIP_FROM_ADDRESS_COUNTRY_CODE',
        'ShipmentRequestDetails.ShipFromAddress.Email': 'SHIP_FROM_ADDRESS_EMAIL',
        'ShipmentRequestDetails.ShipFromAddress.Phone': 'SHIP_FROM_ADDRESS_PHONE',
        'ShipmentRequestDetails.ShippingServiceOptions.DeliveryExperience': 'DELIVERY_EXPERIENCE',
        'ShipmentRequestDetails.ShippingServiceOptions.CarrierWillPickUp': 'CARRIER_WILL_PICKUP',
        'ShipmentRequestDetails.ItemList.Item.1.OrderItemId': 'ORDER_ITEM_ID',
        'ShipmentRequestDetails.ItemList.Item.1.Quantity': 'QUANTITY'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
};

merchantFulfillmentRequest();