'use strict';

var AmazonMwsResource = require('../AmazonMwsResource');
var amazonMwsMethod = AmazonMwsResource.method;

module.exports = AmazonMwsResource.extend({

    path: 'Recommendations',
    searchFor: amazonMwsMethod({
        method: 'POST'
    })

});
