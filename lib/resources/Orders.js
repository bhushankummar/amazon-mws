'use strict';

var path = require('path');
var AmazonMwsResource = require('../AmazonMwsResource');
var amazonMwsMethod = AmazonMwsResource.method;

module.exports = AmazonMwsResource.extend({

    path: 'Orders',
    search: amazonMwsMethod({
        method: 'GET'
    })

});
