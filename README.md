# spreedly-api 
[![Build Status](https://travis-ci.org/bhushankumarl/spreedly-api.svg?branch=master)](https://travis-ci.org/bhushankumarl/spreedly-api)

This API supported Amazon MWS's v1 standard REST-style API that accepts/returns JSON requests and Here is the [API reference] (https://docs.spreedly.com/reference/api/v1)

You can find [examples here](https://github.com/bhushankumarl/spreedly-api/tree/master/examples). This will help you for faster implmentation of 'spreedly-api'

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
    amazonMws.seller.create({
        'gateway': {
            'gateway_type': 'test'
        }
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

