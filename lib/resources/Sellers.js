'use strict';

var path = require('path');
var AmazonMwsResource = require('../AmazonMwsResource');
var amazonMwsMethod = AmazonMwsResource.method;

var prefix = 'Sellers';
var version = '2011-07-01';

module.exports = AmazonMwsResource.extend({

    path: prefix + '/' + version,
    action: amazonMwsMethod({
        method: 'GET'
    })

});
