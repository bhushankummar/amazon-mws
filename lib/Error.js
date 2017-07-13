'use strict';

var utils = require('./utils');

module.exports = _Error;

/**
 * Generic Error Class to wrap any errors returned by AmazonMws-node
 */
function _Error() {
    this.populate.apply(this, arguments);
    this.stack = (new Error(this.message)).stack;
}

// Extend Native Error
_Error.prototype = Object.create(Error.prototype);

_Error.prototype.type = 'GenericError';
_Error.prototype.populate = function (type, message) {
    this.type = type;
    this.message = message;
};

_Error.extend = utils.protoExtend;

/**
 * Create subclass of internal Error klass
 * (Specifically for errors returned from AmazonMws's REST API)
 */
var AmazonMwsError = _Error.AmazonMwsError = _Error.extend({
    type: 'AmazonMwsError',
    populate: function (raw) {
        // Move from prototype def (so it appears in stringified obj)
        this.type = raw.type;

        this.stack = (new Error(raw.message)).stack;
        this.rawType = raw.type;
        this.code = raw.code;
        this.param = raw.param;
        this.message = raw.message;
        this.detail = raw.detail;
        this.raw = raw;
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
