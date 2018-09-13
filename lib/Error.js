'use strict';

var debug = require('debug')('MWS:Error.js');
var utils = require('./utils');

module.exports = _Error;

/**
 * Generic Error Class to wrap any errors returned by AmazonMws-node
 */
function _Error() {
    this.populate.apply(this, arguments);
    var stack = (new Error(this.message)).stack;
    debug('stack ', stack);
}

// Extend Native Error
_Error.prototype = Object.create(Error.prototype);

_Error.prototype.type = 'GenericError';
_Error.prototype.populate = function (type, message) {
    this.Type = type;
    this.Message = message;
};

_Error.extend = utils.protoExtend;

/**
 * Create subclass of internal Error klass
 * (Specifically for errors returned from AmazonMws's REST API)
 */
var AmazonMwsError = _Error.AmazonMwsError = _Error.extend({
    Type: 'AmazonMwsError',
    Message: '',
    populate: function (raw) {
        this.Type = this.type || 'unknown';
        this.Code = raw.Code || 'GenericError';
        this.Message = raw.message || raw.error || 'unknown';
        this.StatusCode = raw.StatusCode || 'unknown';
    }
});

/**
 * Helper factory which takes raw AmazonMws errors and outputs wrapping instances
 */
AmazonMwsError.generate = function () {
    return new _Error('Generic', 'Unknown Error');
};

// Specific AmazonMws Error types:
_Error.AmazonMwsInvalidRequestError = AmazonMwsError.extend({type: 'AmazonMwsInvalidRequestError'});
_Error.AmazonMwsAPIError = AmazonMwsError.extend({type: 'AmazonMwsAPIError'});
_Error.AmazonMwsAuthenticationError = AmazonMwsError.extend({type: 'AmazonMwsAuthenticationError'});
_Error.AmazonMwsPermissionError = AmazonMwsError.extend({type: 'AmazonMwsPermissionError'});
_Error.AmazonMwsRateLimitError = AmazonMwsError.extend({type: 'AmazonMwsRateLimitError'});
_Error.AmazonMwsConnectionError = AmazonMwsError.extend({type: 'AmazonMwsConnectionError'});
