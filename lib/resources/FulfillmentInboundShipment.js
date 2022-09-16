'use strict';

var AmazonMwsResource = require('../AmazonMwsResource');
var amazonMwsMethod = AmazonMwsResource.method;

module.exports = AmazonMwsResource.extend({

    path: 'FulfillmentInboundShipment',
    search: amazonMwsMethod({
        useBody: false,
        method: 'POST'
    }),

    searchFor: amazonMwsMethod({
        useBody: true,
        method: 'POST'
    })

});
