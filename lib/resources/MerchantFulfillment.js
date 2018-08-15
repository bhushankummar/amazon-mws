'use strict';

var AmazonMwsResource = require('../AmazonMwsResource');
var amazonMwsMethod = AmazonMwsResource.method;

module.exports = AmazonMwsResource.extend({

    path: 'MerchantFulfillment',
    search: amazonMwsMethod({
        method: 'GET'
    }),

    create: amazonMwsMethod({
        method: 'GET'
    })

});
