'use strict';

var debug = require('debug')('MWS:AmazonMwsResource');
var http = require('http');
var https = require('https');
var objectAssign = require('object-assign');
var path = require('path');
var xml2json = require('xml2json');
var crypto = require('crypto');
var _ = require('lodash');
var qs = require('qs');
var csv = require('fast-csv');

var utils = require('./utils');
var Error = require('./Error');

var hasOwn = {}.hasOwnProperty;

var RESPONSE_CONTENT_TYPE = ['text/xml', 'text/xml;charset=utf-8'];
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

            callback.call(
              self,
              new Error.AmazonMwsConnectionError({
                  message: 'Request aborted due to timeout being reached (' + timeout + 'ms)',
                  detail: timeoutErr
              }),
              null
            );
        };
    },

    _responseHandler: function (req, callback) {
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

        function processResponseType(res, response, callback) {
            debug('response %o ', response);
            //debug('res.headers %o ', res.headers);
            if (RESPONSE_CONTENT_TYPE.indexOf(res.headers['content-type'].toLowerCase()) > -1) {
                debug('It is XML Response');
                response = xml2json.toJson(response);
                //debug('response after parsing JSON %o ', response);
                response = JSON.parse(response);
                response.Headers = {
                    'x-mws-quota-max': res.headers['x-mws-quota-max'],
                    'x-mws-quota-remaining': res.headers['x-mws-quota-remaining'],
                    'x-mws-quota-resetson': res.headers['x-mws-quota-resetson'],
                    'x-mws-timestamp': res.headers['x-mws-timestamp']
                };
                //debug('after adding hewader response', response);
                return callback(null, response);
            } else {
                debug('It is NON-XML Response');
                var data = [];
                csv.fromString(response, {headers: true, delimiter: '\t'})
                  .on('data', function (value) {
                      data.push(value);
                  })
                  .on('end', function () {
                      debug('response after parsing tab delimited file %o ', data);
                      return callback(null, data);
                  });
            }
        }

        return function (res) {
            var responseString = '';
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                responseString += chunk;
            });
            res.on('end', function () {
                try {
                    //debug('self.requestParamsJSON ', self.requestParamsJSON);

                    processResponseType(res, responseString, function (error, response) {

                        if (error) {
                            debug('Error ', error);
                            return callback.call(
                              self,
                              new Error.AmazonMwsAPIError({
                                  message: 'Failed to parse response received from the AmazonMws API',
                                  response: response,
                                  exception: error
                              }),
                              null
                            );
                        }

                        if (response.ErrorResponse) {
                            var errorResponse = response.ErrorResponse.Error;
                            errorResponse.RequestId = response.ErrorResponse.RequestID || response.ErrorResponse.RequestId;
                            return callback.call(self, errorResponse, null);
                        }

                        var ResponseMetadata = {};
                        var Headers = {};
                        //debug('res.headers[content-type]', res.headers['content-type']);
                        if (RESPONSE_CONTENT_TYPE.indexOf(res.headers['content-type'].toLowerCase()) > -1) {
                            //debug('response.headers', response.headers);
                            debug('response Before Process %o ', JSON.stringify(response));
                            Headers = response.Headers;
                            if (response[self.requestParamsJSON.Action + 'Response']) {
                                response = response[self.requestParamsJSON.Action + 'Response'];
                            }
                            //debug('response', response);
                            try {
                                ResponseMetadata = response.ResponseMetadata;
                            } catch (exception) {
                                debug('exception', exception);
                                ResponseMetadata = {};
                            }
                            if (response[self.requestParamsJSON.Action + 'Result']) {
                                response = response[self.requestParamsJSON.Action + 'Result'];
                            }

                            response.Headers = Headers;
                            debug('response before %o ', JSON.stringify(response));
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


                } catch (e) {
                    return callback.call(
                      self,
                      new Error.AmazonMwsAPIError({
                          message: 'Invalid JSON received from the AmazonMws API',
                          response: responseString,
                          exception: e
                      }),
                      null
                    );
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
            callback.call(
              self,
              new Error.AmazonMwsConnectionError({
                  message: 'An error occurred with our connection to AmazonMws',
                  detail: error
              }),
              null
            );
        };
    },

    _request: function (method, path, data, auth, options, callback) {
        var self = this;
        //debug('path ', path);
        self.requestParams = data;
        self.body = '';
        if (!self.requestParams.Version) {
            return callback.call(
              self,
              new Error.AmazonMwsAPIError({
                  message: 'Please specify the Amazon MWS API Version',
                  detail: 'http://docs.developer.amazonservices.com',
                  type: 'GenericError'
              }),
              null
            );
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
        stringToSign = stringToSign.replace(/'/g, "%27");
        stringToSign = stringToSign.replace(/\*/g, "%2A");
        stringToSign = stringToSign.replace(/\(/g, "%28");
        self.requestParams.Signature = crypto.createHmac('sha256', this._AmazonMws.getApiField('secret')).update(stringToSign, 'utf8').digest('base64');

        self.requestParamsJSON = _.clone(self.requestParams);
        self.requestParams = qs.stringify(self.requestParams);
        /*
         * Use Feed Content without modify it as querystring for the SubmitFeed API
         */
        //self.body = qs.stringify(self.body);

        var headers = {
            'Accept': 'text/xml',
            'Content-Type': 'text/xml',
            'Content-MD5': crypto.createHash('md5').update(self.requestParams).digest('base64')
        };

        if (self.requestParamsJSON.Action === 'SubmitFeed') {
            headers['Content-Type'] = 'x-www-form-urlencoded';
            headers['Content-MD5'] = self.requestParamsJSON.ContentMD5Value;
        }

        // Grab client-user-agent before making the request:
        this._AmazonMws.getClientUserAgent(function () {
            if (options.headers) {
                objectAssign(headers, options.headers);
            }
            makeRequest();
        });

        function makeRequest() {
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
            params.path = params.path + '?' + self.requestParams;

            /*debug('params %o ', params);
             debug('body %o ', self.body);*/
            var req = (isInsecureConnection ? http : https).request(params);

            req.setTimeout(timeout, self._timeoutHandler(timeout, req, callback));
            req.on('response', self._responseHandler(req, callback));
            req.on('error', self._errorHandler(req, callback));

            req.on('socket', function (socket) {
                socket.on((isInsecureConnection ? 'connect' : 'secureConnect'), function () {
                    // Send payload; we're safe:
                    //debug('body %o ', self.body);
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
