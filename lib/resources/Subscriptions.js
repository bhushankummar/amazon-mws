'use strict';

var AmazonMwsResource = require('../AmazonMwsResource');
var amazonMwsMethod = AmazonMwsResource.method;

module.exports = AmazonMwsResource.extend({

    path: 'Subscriptions',
    create: amazonMwsMethod({
        method: 'POST'
    }),
    remove: amazonMwsMethod({
        method: 'POST'
    }),
    searchFor: amazonMwsMethod({
        method: 'POST'
    })

});
