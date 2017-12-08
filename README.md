# amazon-mws (Amazon Marketplace Web Service)
[![Build Status](https://travis-ci.org/bhushankumarl/amazon-mws.svg?branch=master)](https://travis-ci.org/bhushankumarl/amazon-mws)

This API supported Amazon Marketplace Web Service(MWS)'s standard REST-style API that accepts/returns JSON requests and Here is the [API reference] (http://docs.developer.amazonservices.com/en_IN/dev_guide/DG_IfNew.html)

You can find [examples here](https://github.com/bhushankumarl/amazon-mws/tree/master/examples). This will help you for faster implmentation of Amazon Marketplace Web Service's(MWS).

##### It does supports EcmaScript 5, EcmaScript 6,  EcmaScript 8, TypeScript, async-await, Promises, Callback !
##### It supports pure JSON response.
##### All methods support Promise and Callback both.
##### Please Feel free to create Issue for any help !

## Installation
```bash
$ npm install amazon-mws --save
```

## Debugging

Run the DEBUG:

```bash
export DEBUG=MWS:*
```


## Usage

```bash
export AWS_ACCESS_KEY_ID=KEY
export AWS_SECRET_ACCESS_KEY=SECRET
```

## Configuration

Set your Access Key and Access Secret.

```js
var amazonMws = require('amazon-mws')('AWS_ACCESS_KEY_ID','AWS_SECRET_ACCESS_KEY');
```

### Feeds

#### Submit Feed
```js
    var FeedContent = fs.readFileSync('./file.txt', 'UTF-8');

    amazonMws.feeds.submit({
        'Version': '2009-01-01',
        'Action': 'SubmitFeed',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'FeedType': '_POST_PRODUCT_DATA_',
        'FeedContent': FeedContent
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

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

### Finances

#### List Financial Event Groups
```js
    amazonMws.finances.search({
        'Version': '2015-05-01',
        'Action': 'ListFinancialEventGroups',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'FinancialEventGroupStartedAfter': new Date(13, 12, 2016)
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

### FulfillmentInboundShipment

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


### FulfillmentOutboundShipment

#### List All Fulfillment Orders
```js
    amazonMws.fulfillmentOutboundShipment.search({
        'Version': '2010-10-01',
        'Action': 'ListAllFulfillmentOrders',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'QueryStartDateTime': new Date(13, 12, 2016)
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

### FulfillmentInventory

#### List Inventory Supply
```js
    amazonMws.fulfillmentInventory.search({
        'Version': '2010-10-01',
        'Action': 'ListInventorySupply',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'MarketplaceId': 'MARKET_PLACE_ID',
        'QueryStartDateTime': new Date(13, 12, 2016)
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

### Orders

#### List Orders
```js
    amazonMws.orders.search({
        'Version': '2013-09-01',
        'Action': 'ListOrders',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'MarketplaceId.Id.1': 'MARKET_PLEACE_ID_1',
        'LastUpdatedAfter': new Date(13, 12, 2016)
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

### Products

#### List Matching Products
```js
    amazonMws.products.search({
        'Version': '2011-10-01',
        'Action': 'ListMatchingProducts',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'MarketplaceId': 'MARKET_PLACE_ID',
        'Query':'k'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

#### List Matching Products Using Promise
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
        // asynchronously called
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
        // asynchronously called
    });
```

### Reports

#### Get Report List
```js
    amazonMws.reports.search({
        'Version': '2009-01-01',
        'Action': 'GetReportList',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'ReportTypeList.Type.1': 'REPORT_TYPE_LIST'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
```

#### Get Report
###### This will provide you JSON report/data.
```js
    amazonMws.reports.search({
        'Version': '2009-01-01',
        'Action': 'GetReport',
        'SellerId': 'SELLER_ID',
        'MWSAuthToken': 'MWS_AUTH_TOKEN',
        'ReportId':'REPORT_ID'
    }, function (error, response) {
        if (error) {
            console.log('error ', error);
            return;
        }
        console.log('response', response);
    });
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
Originally by [Bhushankumar Lilapara](https://github.com/bhushankumarl) (bhushankumar.lilapara@gmail.com).

