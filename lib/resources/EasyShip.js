'use strict';

var AmazonMwsResource = require('../AmazonMwsResource');
var amazonMwsMethod = AmazonMwsResource.method;

module.exports = AmazonMwsResource.extend({

    path: 'EasyShip',
    search: amazonMwsMethod({
        method: 'GET'
    })

});
