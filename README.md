# amazon-mws
[![Build Status](https://travis-ci.org/bhushankumarl/spreedly-api.svg?branch=master)](https://travis-ci.org/bhushankumarl/spreedly-api)

This API supported Amazon MWS's v1 standard REST-style API that accepts/returns JSON requests and Here is the [API reference] (http://docs.developer.amazonservices.com/en_IN/dev_guide/DG_IfNew.html)

You can find [examples here](https://github.com/bhushankumarl/amazon-mws/tree/master/examples/sellers). This will help you for faster implmentation of 'amazon-mws'

## Installation
```bash
$ npm install amazon-mws --save
```

## Development

Run the installation:

```bash
$ npm install
```

## Configuration

Set your Access Key and Access Secret.

```js
var amazonMws = require('amazon-mws')('accessKey')('accessSecret');
```
### Seller

#### List Marketplace Participations
```js
    amazonMws.sellers.listMarketplaceParticipations({
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

Originally by [Bhushankumar Lilapara](https://github.com/bhushankumarl) (bhushankumar.lilapara@gmail.com).

