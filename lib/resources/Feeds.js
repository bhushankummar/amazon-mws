'use strict';

var AmazonMwsResource = require('../AmazonMwsResource');
var amazonMwsMethod = AmazonMwsResource.method;

module.exports = AmazonMwsResource.extend({

    path: 'Feeds',
    search: amazonMwsMethod({
        method: 'GET'
    }),
    submit: amazonMwsMethod({
        method: 'POST'
    })

});
