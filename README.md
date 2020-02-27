# amazon-mws (Amazon Marketplace Web Service)
[![Version](https://img.shields.io/npm/v/amazon-mws.svg)](https://www.npmjs.org/package/amazon-mws)
[![Build Status](https://travis-ci.org/bhushankumarl/amazon-mws.svg?branch=master)](https://travis-ci.org/bhushankumarl/amazon-mws)

This API supported Amazon Marketplace Web Service(MWS)'s standard REST-style API that accepts/returns JSON requests and Here is the [API reference, Click Here](http://docs.developer.amazonservices.com/en_IN/dev_guide/DG_IfNew.html)

You can testify API through [Amazon MWS Scratchpad](https://mws.amazonservices.in/scratchpad/index.html) without any installation.

You can find [examples of JavaScript and TypeScript Click here](https://github.com/bhushankumarl/amazon-mws/tree/master/examples). This will help you for faster implementation of Amazon Marketplace Web Service's(MWS).

##### It does supports EcmaScript 5, EcmaScript 6,  EcmaScript 8, TypeScript, async-await, Promises, Callback !
##### It does also supports for AWS Lambda like serverless cloud function call.
##### It supports pure JSON response.
##### All methods support Promise and Callback both.
##### Please Feel free to create Issue for any help !
##### All developers/contributors are requested to open Pull Request/Merge Request on development branch. Please make sure Test Cases be passed.

## Installation
```bash
npm install amazon-mws --save
```

## Test Cases
```bash
npm run test.mocha
```

## Debugging
```bash
export DEBUG=MWS:*
```

## Usage
```bash
export AWS_ACCESS_KEY_ID=KEY
export AWS_SECRET_ACCESS_KEY=SECRET
```

## Configuration Using JavaScript
```js
var amazonMws = require('amazon-mws')('AWS_ACCESS_KEY_ID','AWS_SECRET_ACCESS_KEY');
```

## Override the Host (Default mws.amazonservices.com)
```js
amazonMws.setHost('YOUR HOST');
```

## Set Response Format (Default JSON)
```js
amazonMws.setResponseFormat('XML');
```

## Set Proxy
```js
amazonMws.setProxy('http://your.proxy.domain');
```

## Configuration Using TypeScript
```typescript
import MwsApi from 'amazon-mws';

const amazonMws = new MwsApi();
amazonMws.setApiKey(accessKey, accessSecret);
```

## Pull Request
- Contributors can send their Pull Request to `development` branch.
- Kindly validate test cases before opening new PR.
- Kindly validate linting before opening new PR.

## Test Cases ENV
```bash
export AWS_ACCESS_KEY_ID=SAMPLE
export AWS_SECRET_ACCESS_KEY=SAMPLE
export SELLER_ID=SAMPLE
export MARKETPLACE_ID=SAMPLE
export ASIN=SAMPLE
export SKU=SAMPLE
```

#### Success or Error StatusCode can be obtained directly using StatusCode property of response. It will give you same as what Amazon MWS provides.
#### It is also sample of the error responses.
```
{
   Type:'Sender',
   Code:'InvalidRequestException',
   Message:'Invalid xxxxx: ',
   Headers: {
      'x-mws-quota-max': '',
      'x-mws-quota-remaining': '',
      'x-mws-quota-resetson': '',
      'x-mws-timestamp': '2018-09-05T06:13:00.276Z',
      'content-type': 'text/xml',
      'content-charset': '',
      'content-length': '',
      'content-md5': '',
      'date': ''
   },
   StatusCode:400,
   RequestId: 'XXXXX-XXXXXX-XXXXX'
}
```

#### Additionally all api returns Throttling: Limits to how often you can submit requests
Reference : http://docs.developer.amazonservices.com/en_CA/dev_guide/DG_Throttling.html
```json
{
  "x-mws-quota-max": "60.0",
  "x-mws-quota-remaining": "38.0",
  "x-mws-quota-resetson": "2017-12-08T08:21:00.000Z",
  "x-mws-timestamp": "2017-12-08T07:52:15.567Z"
}
```
## Do you need an expert?
Are you finding a developer for your world-class product? If yes, please contact here. [Submit your project request here.](https://goo.gl/forms/UofdG5GY5iHMoUWg2)
Originally by [Bhushankumar L](mailto:bhushankumar.lilapara@gmail.com).

## Examples
### Feeds
#### Get Feed Submission List
```js
    amazonMws.feeds.search({
        'Version': '2009-01-01',
        'Action': 'GetFeedSubmissionList',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

#### Get Feed Submission Result
```js
    var FeedSubmissionId = '10101010XXX';
    amazonMws.feeds.search({
        'Version': '2009-01-01',
        'Action': 'GetFeedSubmissionResult',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'FeedSubmissionId': FeedSubmissionId
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

#### Get Feed Submission Result Charset
```js
    /**
     * Use __CHARSET__ to override charset option.;
     * This along with __RAW__ do NOT get written in the request.
     */
    var FeedSubmissionId = '10101010XXX';
    amazonMws.feeds.search({
        'Version': '2009-01-01',
        'Action': 'GetFeedSubmissionResult',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'FeedSubmissionId': FeedSubmissionId,
        // __CHARSET__: 'latin1'
        __CHARSET__: 'ISO-8859-1'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response ', JSON.stringify(response));
    });
```

#### Get Feed Submission Result Raw
```js
    /**
     * Use __RAW__ to get the raw response in response->data;
     * This along  with __CHARSET__ do not get written in the request.
     */
    var FeedSubmissionId = '10101010XXX';
    amazonMws.feeds.search({
        'Version': '2009-01-01',
        'Action': 'GetFeedSubmissionResult',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'FeedSubmissionId': FeedSubmissionId,
        __RAW__: true
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        fse.writeFileSync('response.txt', response.data);
        console.log('Headers', response.Headers);
    });
```

#### Submit Feed
```js
var FeedContent = fse.readFileSync('./good.xml', 'UTF-8');
    console.log('FeedContent ', FeedContent);

    amazonMws.feeds.submit({
        'Version': '2009-01-01',
        'Action': 'SubmitFeed',
        'FeedType': '_POST_PRODUCT_DATA_',
        'FeedContent': FeedContent,
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

### Finances
#### List Financial Event Groups
```js
    amazonMws.finances.search({
        'Version': '2015-05-01',
        'Action': 'ListFinancialEventGroups',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'FinancialEventGroupStartedAfter': new Date(2016, 11, 24)
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

### Fulfillment Inbound Shipment
#### Get Inbound Guidance For SKU
```js
    amazonMws.fulfillmentInboundShipment.search({
        'Version': '2010-10-01',
        'Action': 'GetInboundGuidanceForSKU',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'MarketplaceId': 'MARKET_PLACE_ID',
        'SellerSKUList.Id.1': 'us001'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

### Fulfillment Inventory
#### List Inventory Supply
```js
    amazonMws.fulfillmentInventory.search({
        'Version': '2010-10-01',
        'Action': 'ListInventorySupply',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'MarketplaceId': 'MARKET_PLACE_ID',
        'QueryStartDateTime': new Date(2016, 11, 24)
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

### Fulfillment Outbound Shipment
#### Create Fulfillment Order
```js
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
```

#### List All Fulfillment Orders
```js
    amazonMws.fulfillmentOutboundShipment.search({
        'Version': '2010-10-01',
        'Action': 'ListAllFulfillmentOrders',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'QueryStartDateTime': new Date(2016, 11, 24)
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

### Merchant Fulfillment
#### Create Shipment
```js
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
```

#### Get Eligible Shipping Services
```js
    amazonMws.merchantFulfillment.search({
        'Version': '2015-06-01',
        'Action': 'GetEligibleShippingServices',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
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
```

### Orders
#### List Order Items
```js
    amazonMws.orders.search({
        'Version': '2013-09-01',
        'Action': 'ListOrderItems',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'AmazonOrderId': 'AMAZON_ORDER_ID'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

#### List Orders
```js
    amazonMws.orders.search({
        'Version': '2013-09-01',
        'Action': 'ListOrders',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'MarketplaceId.Id.1': 'MARKET_PLACE_ID_1',
        'LastUpdatedAfter': new Date(2016, 11, 24)
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

#### List Orders Filter Status
```js
    amazonMws.orders.search({
        'Version': '2013-09-01',
        'Action': 'ListOrders',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'MarketplaceId.Id.1': 'MARKET_PLACE_ID_1',
        'LastUpdatedAfter': new Date(2016, 11, 24),
        'OrderStatus.Status.1': 'Pending',
        'OrderStatus.Status.2': 'Canceled'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

### Products
#### Get Competitive Pricing For ASIN
```js
    amazonMws.products.searchFor({
        'Version': '2011-10-01',
        'Action': 'GetCompetitivePricingForASIN',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'MarketplaceId': 'MARKET_PLACE_ID',
        'ASINList.ASIN.1': 'ASIN'
    }, function (error, response) {
        if (error) {
            console.log('error products', error);
            return;
        }
        console.log('response ', response);
    });
```

#### Get Lowest Priced Offers For ASIN
```js
    amazonMws.products.searchFor({
        'Version': '2011-10-01',
        'Action': 'GetLowestPricedOffersForASIN',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'MarketplaceId': 'MARKET_PLACE_ID',
        'ASIN': 'ASIN',
        'ItemCondition': 'New'
    }, function (error, response) {
        if (error) {
            console.log('error products', error);
            return;
        }
        console.log('response ', response);
    });
```

#### Get Lowest Priced Offers For SKU
```js
    amazonMws.products.searchFor({
        'Version': '2011-10-01',
        'Action': 'GetLowestPricedOffersForSKU',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'MarketplaceId': 'MARKET_PLACE_ID',
        'SellerSKU': 'SELLER_SKU',
        'ItemCondition': 'New'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response ', response);
    });
```

#### Get Matching Product
```js
    amazonMws.products.search({
        'Version': '2011-10-01',
        'Action': 'GetMatchingProduct',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'MarketplaceId': 'MARKET_PLACE_ID',
        'ASINList.ASIN.1': 'ASIN_1'
    }, function (error, response) {
        if (error) {
            console.log('error products', error);
            return;
        }
        //console.log('response ', JSON.stringify(response));
        console.log('response', response);
    });
```

#### Get Matching Product For Id
```js
    amazonMws.products.search({
        'Version': '2011-10-01',
        'Action': 'GetMatchingProductForId',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'MarketplaceId': 'MARKET_PLACE_ID',
        'IdType': 'SellerSKU',
        'IdList.Id.1': 'SKU'
    }, function (error, response) {
        if (error) {
            console.log('error products', error);
            return;
        }
        console.log('response', response);
    });
```

#### Get Matching Product Multiple ASIN
```js
    var ASINList = ['ASIN.1', 'ASIN.2'];
    var data = {
        'Version': '2011-10-01',
        'Action': 'GetMatchingProduct',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'MarketplaceId': 'MARKET_PLACE_ID'
    };
    var index = 1;
    for (var i in ASINList) {
        data['ASINList.ASIN.' + index] = ASINList[i];
        index++;
    }
    amazonMws.products.search(data, function (error, response) {
        if (error) {
            console.log('error products', error);
            return;
        }
        //console.log('response ', JSON.stringify(response));
        console.log('response', response);
    });
```

#### Get My Fees Estimate
```js
    amazonMws.products.search({
        'Version': '2011-10-01',
        'Action': 'GetMyFeesEstimate',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'FeesEstimateRequestList.FeesEstimateRequest.1.MarketplaceId': 'MARKET_PLACE_ID',
        'FeesEstimateRequestList.FeesEstimateRequest.1.IdType': 'ASIN',
        'FeesEstimateRequestList.FeesEstimateRequest.1.IdValue': 'ASIN',
        'FeesEstimateRequestList.FeesEstimateRequest.1.IsAmazonFulfilled': 'true',
        'FeesEstimateRequestList.FeesEstimateRequest.1.Identifier': 'Hello',
        'FeesEstimateRequestList.FeesEstimateRequest.1.PriceToEstimateFees.ListingPrice.CurrencyCode': 'USD',
        'FeesEstimateRequestList.FeesEstimateRequest.1.PriceToEstimateFees.ListingPrice.Amount': '30.00',
        'FeesEstimateRequestList.FeesEstimateRequest.1.PriceToEstimateFees.Shipping.CurrencyCode': 'USD',
        'FeesEstimateRequestList.FeesEstimateRequest.1.PriceToEstimateFees.Shipping.Amount': '3.99',
        'FeesEstimateRequestList.FeesEstimateRequest.1.PriceToEstimateFees.Points.PointsNumber': '0'
    }, function (error, response) {
        if (error) {
            console.log('error products', error);
            return;
        }
        console.log('response ', response);
    });
```

#### Get My Price For ASIN
```js
    amazonMws.products.searchFor({
        'Version': '2011-10-01',
        'Action': 'GetMyPriceForASIN',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'MarketplaceId': 'MARKET_PLACE_ID',
        'ASINList.ASIN.1': 'ASINList_ASIN_1'
    }, function (error, response) {
        if (error) {
            console.log('error products', error);
            return;
        }
        console.log('response ', response);
    });
```

#### List Matching Products
```js
    amazonMws.products.search({
        'Version': '2011-10-01',
        'Action': 'ListMatchingProducts',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'MarketplaceId': 'MARKET_PLACE_ID',
        'Query': 'k'
    }, function (error, response) {
        if (error) {
            console.log('error products', error);
            return;
        }
        //console.log('response ', JSON.stringify(response));
        console.log('response', response);
    });
```

### Recommendations
#### Get Last Updated Time For Recommendations
```js
    amazonMws.recommendations.searchFor({
        'Version': '2013-04-01',
        'Action': 'GetLastUpdatedTimeForRecommendations',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'MarketplaceId': 'MARKET_PLACE_ID'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

#### List Recommendations
```js
    amazonMws.recommendations.searchFor({
        'Version': '2013-04-01',
        'Action': 'ListRecommendations',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'MarketplaceId': 'MARKET_PLACE_ID',
        'CategoryQueryList.CategoryQuery.1.FilterOptions.FilterOption.1': 'QualitySet=Defect',
        'CategoryQueryList.CategoryQuery.1.FilterOptions.FilterOption.2': 'ListingStatus=Active',
        'CategoryQueryList.CategoryQuery.1.RecommendationCategory': 'ListingQuality'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

### Reports
#### Get Report
```js
    /**
     * This will not provide you Throttling details in Header.
     * Amazon MWS itself not providing Throttling detail in GetReport call.
     */
    amazonMws.reports.search({
        'Version': '2009-01-01',
        'Action': 'GetReport',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'ReportId': 'REPORT_ID'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

#### Get Report List
```js
    amazonMws.reports.search({
        'Version': '2009-01-01',
        'Action': 'GetReportList',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN'
        //'ReportTypeList.Type.1': 'REPORT_TYPE_LIST' //optional
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

#### Get Report Request List
```js
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
```

#### Request Report
```js
    amazonMws.reports.submit({
        'Version': '2009-01-01',
        'Action': 'RequestReport',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'ReportType': '_GET_MERCHANT_LISTINGS_ALL_DATA_'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

### Sample
#### Get Matching Product Async Await
```js
    try {
        var response = await amazonMws.products.search({
            'Version': '2011-10-01',
            'Action': 'GetMatchingProduct',
            'SellerId': 'SELLER_ID',
            'MWSAuthToken': 'MWS_AUTH_TOKEN',
            'MarketplaceId': 'MARKET_PLACE_ID',
            'ASINList.ASIN.1': 'ASIN_1'
        });
        console.log('response', response);
    } catch (error) {
        console.log('error products', error);
    }
```

#### Get Matching Product Promise
```js
    amazonMws.products.search({
        'Version': '2011-10-01',
        'Action': 'GetMatchingProduct',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'MarketplaceId': 'MARKET_PLACE_ID',
        'ASINList.ASIN.1': 'ASIN_1'
    }).then(function (response) {
        console.log('response', response);
    }).catch(function (error) {
        console.log('error products', error);
    });
```

#### Get Report As Readable Stram
```js
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
```

#### List Orders
```js
    amazonMws.setApiKey(accessKey, accessSecret);
    amazonMws.setHost('YOUR HOST');

    // amazonMws.setHost('YOUR HOST', 443); // Alternate way
    // amazonMws.setHost('YOUR HOST', 443, 'https'); // Alternate way

    amazonMws.orders.search({
        'Version': '2013-09-01',
        'Action': 'ListOrders',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'MarketplaceId.Id.1': 'MARKET_PLACE_ID_1',
        'LastUpdatedAfter': new Date(2016, 11, 24)
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

#### Request Report Content Type
```js
    amazonMws.setContentType('application/json');

    amazonMws.reports.submit({
        'Version': '2009-01-01',
        'Action': 'RequestReport',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'ReportType': '_GET_MERCHANT_LISTINGS_ALL_DATA_'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

#### Request Report Proxy
```js
    amazonMws.setProxy('http://your.proxy.domain');

    amazonMws.reports.submit({
        'Version': '2009-01-01',
        'Action': 'RequestReport',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'ReportType': '_GET_MERCHANT_LISTINGS_ALL_DATA_'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

#### Request Report XML Response
```js
    amazonMws.setResponseFormat('XML');

    amazonMws.reports.submit({
        'Version': '2009-01-01',
        'Action': 'RequestReport',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'ReportType': '_GET_MERCHANT_LISTINGS_ALL_DATA_'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

### Sellers
#### List Marketplace Participations
```js
    amazonMws.sellers.search({
        'Version': '2011-07-01',
        'Action': 'ListMarketplaceParticipations',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

#### List Marketplace Participations By Next Token
```js
    amazonMws.sellers.search({
        'Version': '2011-07-01',
        'Action': 'ListMarketplaceParticipationsByNextToken',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'NextToken': 'NEXT_TOKEN'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

### Subscriptions
#### Create Subscription
```js
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
```

#### Delete Subscription
```js
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
```

#### List Subscriptions
```js
    amazonMws.subscriptions.searchFor({
        'Version': '2013-07-01',
        'Action': 'ListSubscriptions',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'MarketplaceId': 'MARKET_PLACE_ID'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

#### Register Destination
```js
    amazonMws.subscriptions.create({
        'Version': '2013-07-01',
        'Action': 'RegisterDestination',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'MarketplaceId': 'MARKET_PLACE_ID',
        'Destination.AttributeList.member.1.Key': 'DESTINATION_KEY',
        'Destination.AttributeList.member.1.Value': 'DESTINATION_VALUE',
        'Destination.DeliveryChannel': 'DESTINATION_CHANNEL'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

