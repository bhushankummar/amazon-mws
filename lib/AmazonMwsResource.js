'use strict';

var debug = require('debug')('MWS:AmazonMwsResource');
var http = require('http');
var https = require('https');
var objectAssign = require('object-assign');
var path = require('path');
var xml2js = require('xml2js');
var crypto = require('crypto');
var _ = require('lodash');
var qs = require('qs');
var csv = require('fast-csv');
var iconv = require('iconv-lite');

var utils = require('./utils');
var Error = require('./Error');


var hasOwn = {}.hasOwnProperty;

var RESPONSE_CONTENT_TYPE = ['text/xml', 'text/xml;charset=utf-8', 'application/xml'];
// Provide extension mechanism for AmazonMws Resource Sub-Classes
AmazonMwsResource.extend = utils.protoExtend;

// Expose method-creator & prepared (basic) methods
AmazonMwsResource.method = require('./AmazonMwsMethod');
AmazonMwsResource.BASIC_METHODS = require('./AmazonMwsMethod.basic.js');

/**
 * Encapsulates request logic for a AmazonMws Resource
 */
function AmazonMwsResource(AmazonMws, urlData) {
    this._AmazonMws = AmazonMws;
    this._urlData = urlData || {};

    this.basePath = utils.makeURLInterpolator(AmazonMws.getApiField('basePath'));
    this.path = utils.makeURLInterpolator(this.path);

    if (this.includeBasic) {
        this.includeBasic.forEach(function (methodName) {
            this[methodName] = AmazonMwsResource.BASIC_METHODS[methodName];
        }, this);
    }

    this.initialize.apply(this, arguments);
}

AmazonMwsResource.prototype = {

    path: '',
    requestBody: {},
    requestParamsJSON: {},
    initialize: function () {
    },

    // Function to override the default data processor. This allows full control
    // over how a AmazonMwsResource's request data will get converted into an HTTP
    // body. This is useful for non-standard HTTP requests. The function should
    // take method name, data, and headers as arguments.
    requestDataProcessor: null,

    // String that overrides the base API endpoint. If `overrideHost` is not null
    // then all requests for a particular resource will be sent to a base API
    // endpoint as defined by `overrideHost`.
    overrideHost: null,

    createFullPath: function (commandPath, urlData) {
        return path.join(
          this.basePath(urlData),
          this.path(urlData),
          typeof commandPath === 'function' ?
            commandPath(urlData) : commandPath
        ).replace(/\\/g, '/'); // ugly workaround for Windows
    },

    createUrlData: function () {
        var urlData = {};
        // Merge in baseData
        for (var i in this._urlData) {
            if (hasOwn.call(this._urlData, i)) {
                urlData[i] = this._urlData[i];
            }
        }
        return urlData;
    },

    wrapTimeout: function (promise, callback) {
        if (callback) {
            // Ensure callback is called outside of promise stack.
            return promise.then(function (res) {
                setTimeout(function () {
                    callback(null, res);
                }, 0);
            }, function (err) {
                setTimeout(function () {
                    callback(err, null);
                }, 0);
            });
        }

        return promise;
    },

    _timeoutHandler: function (timeout, req, callback) {
        var self = this;
        return function () {
            var timeoutErr = new Error('ETIMEDOUT');
            timeoutErr.code = 'ETIMEDOUT';

            req._isAborted = true;
            req.abort();

            callback.call(self, new Error.AmazonMwsConnectionError({
                message: 'Request aborted due to timeout being reached (' + timeout + 'ms)'
            }), null);
        };
    },

    _responseHandler: function (requestParamsJSONCopy, req, userOptions, callback) {
        var self = this;

        function processXml(o, action) {
            var type = typeof o;
            if (type === 'object') {
                for (var key in o) {
                    if (key.indexOf('ns2:') > -1) {
                        if (action === 'update') {
                            var temp = key.replace(/^ns2:/, '');
                            o[temp] = o[key];

                        } else if (action === 'delete') {
                            delete o[key];
                        }
                    }
                    if (key.indexOf('$t') > -1) {
                        if (action === 'update') {
                            o['Value'] = o[key];
                        }
                    }
                    var removeKeys = ['xmlns', 'xmlns:ns2', '$t'];
                    if (removeKeys.indexOf(key) > -1 && action === 'delete') {
                        if (action === 'delete') {
                            delete o[key];
                        }
                    }
                    processXml(o[key], action);
                }
            }
        }

        function parseCSVFile(res, responseString, delimiter, callback) {
            var data = [];

            csv.fromString(responseString, {headers: true, delimiter: delimiter, ignoreEmpty: true, quote: null})
              .on('data', function (value) {
                  data.push(value);
              })
              .on('end', function () {
                  var items = {};
                  items.data = data;
                  return callback(null, items);
              })
              .on('error', function (error) {
                  debug('error ', error);
                  return callback(error);
              });
        }

        function processResponseType(res, responseString, callback) {
            //debug('res %o ', res);
            //debug('res.headers %o ', res.headers);
            if (RESPONSE_CONTENT_TYPE.indexOf(res.headers['content-type'].toLowerCase()) > -1) {
                debug('It is XML Response');
                var parser = new xml2js.Parser({
                    explicitArray: false,
                    ignoreAttrs: true
                });

                parser.parseString(responseString, function (err, response) {
                    //debug('response after parsing JSON %o ', response);
                    return callback(null, response);
                });
            } else {
                debug('It is NON-XML Response');
                var TAB_DELIMITER = '\t';
                var COMMA_DELIMITER = ',';
                parseCSVFile(res, responseString, TAB_DELIMITER, function (error, response) {
                    if (!_.isEmpty(error)) {
                        debug('It is TAB_DELIMITER failure.');
                        debug('Let us try to delimit using COMMA_DELIMITER');
                        return parseCSVFile(res, responseString, COMMA_DELIMITER, callback);
                    }
                    return callback(null, response);
                });
            }
        }

        return function (res) {
            debug('----------- Received Response -------------');
            var dbgResponseBuffer = [];
            var headers = res.headers;
            var statusCode = res.statusCode;
            try {
                statusCode = parseInt(statusCode, 10);
            } catch (Exception) {
                debug('Failed to parse statusCode as statusCode not provided in the response. ', statusCode);
            }
            var charset = '';
            var content_type = '';
            var responseString = '';
            if (headers['content-type'].indexOf('charset') > -1 && headers['content-type'].split(';')[0] && headers['content-type'].split(';')[1]) {
                content_type = headers['content-type'].split(';')[0].toLowerCase();
                if (headers['content-type'].split(';')[1].match(/^((\b[^\s=]+)=(([^=]|\\=)+))*$/)[3]) {
                    charset = headers['content-type'].split(';')[1].match(/^((\b[^\s=]+)=(([^=]|\\=)+))*$/)[3];
                }
            } else {
                content_type = headers['content-type'].toLowerCase();
            }

            var ResponseHeaders = {
                'x-mws-quota-max': res.headers['x-mws-quota-max'] || 'unknown',
                'x-mws-quota-remaining': res.headers['x-mws-quota-remaining'] || 'unknown',
                'x-mws-quota-resetson': res.headers['x-mws-quota-resetson'] || 'unknown',
                'x-mws-timestamp': res.headers['x-mws-timestamp'],
                'content-type': content_type || 'unknown',
                'content-charset': charset || 'unknown',
                'content-length': res.headers['content-length'] || 'unknown',
                'content-md5': res.headers['content-md5'] || 'unknown',
                'date': res.headers['date'] || 'unknown'
            };

            res.on('data', function (chunk) {
                dbgResponseBuffer.push(chunk);
            });
            res.on('end', function () {
                var bufferString = Buffer.concat(dbgResponseBuffer);

                /**
                 * You can use Either userRaw or userCharset.
                 * Both of them will not work together.
                 */
                if (userOptions.userRaw === true) {
                    debug('Inside user Raw option');
                    var response = {
                        data: bufferString,
                        Headers: ResponseHeaders
                    };
                    return callback.call(self, null, response);
                }

                if (userOptions.userCharset && userOptions.userCharset.length > 0) {
                    debug('Inside user Charset option');
                    charset = userOptions.userCharset;
                    try {
                        /**
                         * https://github.com/ashtuchkin/iconv-lite/issues/32
                         */
                        var win1251String = iconv.decode(bufferString, 'win1251');
                        responseString = iconv.encode(win1251String, charset);
                    } catch (Exception) {
                        debug('Exception iconv ', Exception);
                        return callback.call(self, new Error.AmazonMwsAPIError({
                            message: 'Failed to parse response received from the AmazonMws API',
                            StatusCode: statusCode || 'unknown'
                        }), null);
                    }
                } else {
                    responseString = bufferString.toString();
                }

                debug('responseString ', responseString);
                debug('content_type ', content_type);
                debug('statusCode ', statusCode);

                if (!content_type) {
                    return callback.call(self, new Error.AmazonMwsAPIError({
                        message: 'Content Type is not provided in response received from the AmazonMws API',
                        StatusCode: statusCode || 'unknown'
                    }), null);
                }

                try {
                    processResponseType(res, responseString, function (error, response) {
                        if (response.ErrorResponse) {
                            debug('It is ErrorResponse');
                            var errorResponse = response.ErrorResponse.Error;
                            errorResponse.Headers = ResponseHeaders;
                            errorResponse.StatusCode = statusCode || 'unknown';
                            errorResponse.RequestId = response.ErrorResponse.RequestID || response.ErrorResponse.RequestId || 'unknown';
                            return callback.call(self, errorResponse, null);
                        } else if (statusCode > 399) {
                            return callback.call(self, new Error.AmazonMwsAPIError({
                                message: response || 'Error occurred from AmazonMws API',
                                StatusCode: statusCode || 'unknown'
                            }), null);
                        } else if (error) {
                            return callback.call(self, new Error.AmazonMwsAPIError({
                                message: 'Failed to parse response received from the AmazonMws API',
                                StatusCode: statusCode || 'unknown'
                            }), null);
                        }

                        var ResponseMetadata = {};
                        if (RESPONSE_CONTENT_TYPE.indexOf(content_type) > -1) {
                            /**
                             * It should execute for only XML response
                             */
                            // debug('response Before Process %o ', JSON.stringify(response));
                            if (response[requestParamsJSONCopy.Action + 'Response']) {
                                response = response[requestParamsJSONCopy.Action + 'Response'];
                            }
                            //debug('response', response);
                            try {
                                ResponseMetadata = response.ResponseMetadata;
                            } catch (exception) {
                                debug('exception', exception);
                                ResponseMetadata = {};
                            }
                            // debug('ResponseMetadata %o ', ResponseMetadata);
                            if (response[requestParamsJSONCopy.Action + 'Result']) {
                                response = response[requestParamsJSONCopy.Action + 'Result'];
                            }

                            response.ResponseMetadata = ResponseMetadata;
                            response.Headers = ResponseHeaders;
                            response.StatusCode = statusCode || 'unknown';
                            // debug('response before %o ', JSON.stringify(response));
                            processXml(response, 'update');
                            processXml(response, 'delete');
                            //debug('response after Process %o ', JSON.stringify(response));
                        }
                        debug('final response %o ', response);
                        // Expose res object
                        Object.defineProperty(response, 'lastResponse', {
                            enumerable: false,
                            writable: false,
                            value: res
                        });
                        callback.call(self, null, response);
                    });
                } catch (exception) {
                    return callback.call(self, new Error.AmazonMwsAPIError({
                        message: 'Invalid XML received from the AmazonMws API',
                        StatusCode: statusCode || 'unknown'
                    }), null);
                }
            });
        };
    },

    _errorHandler: function (req, callback) {
        var self = this;
        return function (error) {
            if (req._isAborted) {
                // already handled
                return;
            }
            callback.call(self, new Error.AmazonMwsConnectionError({
                message: 'An error occurred with our connection to AmazonMws',
                error: error
            }), null);
        };
    },

    _request: function (method, path, data, auth, options, callback) {
        var self = this;
        self.body = '';

        var userRaw = '';
        var userCharset = '';
        /**custom option passed by user, a better way to do this would be nice */
        if (data.__RAW__) {
            userRaw = data.__RAW__;
            delete data.__RAW__;
        }
        if (data.__CHARSET__) {
            userCharset = data.__CHARSET__;
            delete data.__CHARSET__;
        }
        self.requestParams = data;

        if (!self.requestParams.Version) {
            return callback.call(self, new Error.AmazonMwsAPIError({
                message: 'Please specify the Amazon MWS API Version',
                StatusCode: '404'
            }), null);
        } else if (!self._AmazonMws.getApiField('key')) {
            return callback.call(self, new Error.AmazonMwsAPIError({
                message: 'Please specify the AWS_ACCESS_KEY_ID',
                StatusCode: '404'
            }), null);
        } else if (!self._AmazonMws.getApiField('secret')) {
            return callback.call(self, new Error.AmazonMwsAPIError({
                message: 'Please specify the AWS_SECRET_ACCESS_KEY',
                StatusCode: '404'
            }), null);
        }
        if (self.requestParams.APIVersion) {
            path = path + '/' + self.requestParams.APIVersion;
            delete self.requestParams.APIVersion;
        } else {
            path = path + '/' + self.requestParams.Version;
        }

        if (self.requestParams.Action === 'SubmitFeed') {
            /*
             * Use Feed Content without modify it as querystring for the SubmitFeed API
             */
            self.body = self.requestParams.FeedContent;
            self.requestParams.ContentMD5Value = crypto.createHash('md5').update(self.body).digest('base64');
            delete self.requestParams.FeedContent;
        }
        //debug(' self.body %o ', self.body);
        self.requestParams.AWSAccessKeyId = this._AmazonMws.getApiField('key');
        self.requestParams.Timestamp = new Date();
        self.requestParams.SignatureVersion = '2';
        self.requestParams.SignatureMethod = 'HmacSHA256';
        var sorted = _.reduce(_.keys(self.requestParams).sort(), function (m, k) {
            m[k] = self.requestParams[k];
            return m;
        }, {});
        var stringToSign = [method, self._AmazonMws.getApiField('host'), path, qs.stringify(sorted)].join('\n');
        // An RFC (cannot remember which one) requires these characters also be changed:
        stringToSign = stringToSign.replace(/'/g, '%27');
        stringToSign = stringToSign.replace(/\*/g, '%2A');
        stringToSign = stringToSign.replace(/\(/g, '%28');
        self.requestParams.Signature = crypto.createHmac('sha256', this._AmazonMws.getApiField('secret')).update(stringToSign, 'utf8').digest('base64');

        self.requestParamsJSON = _.clone(self.requestParams);
        self.requestParams = '&' + qs.stringify(self.requestParams);
        /**
         * Use Feed Content without modify it as querystring for the SubmitFeed API
         */

        var headers = {
            'Content-Type': 'text/xml',
            'Content-MD5': crypto.createHash('md5').update(self.requestParams).digest('base64')
        };

        if (self.requestParamsJSON.Action === 'SubmitFeed') {
            headers['Content-Type'] = 'x-www-form-urlencoded';
            headers['Content-MD5'] = self.requestParamsJSON.ContentMD5Value;
        }
        /**
         * When their is required to make POST request.
         */
        if (options.useBody === true) {
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
            headers['Content-Length'] = Buffer.byteLength(self.requestParams);
            self.body = self.requestParams;
        }

        // Make a deep copy of the request params, assign to block scoped variable
        var requestParamsCopy = JSON.parse(JSON.stringify(self.requestParams));
        var requestParamsJSONCopy = JSON.parse(JSON.stringify(self.requestParamsJSON));
        // Grab client-user-agent before making the request:
        this._AmazonMws.getClientUserAgent(function () {
            if (options.headers) {
                objectAssign(headers, options.headers);
            }
            makeRequest(requestParamsCopy);
        });

        function makeRequest(requestParamsCopy) {
            var timeout = self._AmazonMws.getApiField('timeout');
            var isInsecureConnection = self._AmazonMws.getApiField('protocol') === 'http';

            var host = self.overrideHost || self._AmazonMws.getApiField('host');
            var params = {
                host: host,
                port: self._AmazonMws.getApiField('port'),
                path: path,
                method: method,
                headers: headers
            };
            if (options.useBody === false) {
                params.path = params.path + '?' + requestParamsCopy;
            }

            debug('params %o ', params);
            debug('self.body %o ', self.body);
            var req = (isInsecureConnection ? http : https).request(params);

            req.setTimeout(timeout, self._timeoutHandler(timeout, req, callback));
            var userOptions = {
                userCharset: userCharset,
                userRaw: userRaw
            };
            req.on('response', self._responseHandler(requestParamsJSONCopy, req, userOptions, callback));
            req.on('error', self._errorHandler(req, callback));

            req.on('socket', function (socket) {
                socket.on((isInsecureConnection ? 'connect' : 'secureConnect'), function () {
                    // Send payload; we're safe:
                    /*
                     * Use Feed Content without modify it as querystring for the SubmitFeed API
                     */
                    req.write(self.body);
                    req.end();
                });
            });
        }
    }

};

module.exports = AmazonMwsResource;
