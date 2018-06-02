'use strict';

// var debug = require('debug')('MWS:amazon-mws');
AmazonMws.DEFAULT_HOST = 'mws.amazonservices.com';
AmazonMws.DEFAULT_PORT = '443';
AmazonMws.DEFAULT_BASE_PATH = '/';
AmazonMws.DEFAULT_RESPONSE_FORMAT = '.json';
AmazonMws.DEFAULT_API_VERSION = null;

// Use node's default timeout:
AmazonMws.DEFAULT_TIMEOUT = require('http').createServer().timeout;

AmazonMws.PACKAGE_VERSION = require('../package.json').version;

AmazonMws.USER_AGENT = {
    bindings_version: AmazonMws.PACKAGE_VERSION,
    lang: 'node',
    lang_version: process.version,
    platform: process.platform,
    publisher: 'amazon-mws',
    uname: null
};

AmazonMws.USER_AGENT_SERIALIZED = null;

var exec = require('child_process').exec;

var resources = {
    feeds: require('./resources/Feeds'),
    finances: require('./resources/Finances'),
    fulfillmentInboundShipment: require('./resources/FulfillmentInboundShipment'),
    fulfillmentOutboundShipment: require('./resources/FulfillmentOutboundShipment'),
    fulfillmentInventory: require('./resources/FulfillmentInventory'),
    sellers: require('./resources/Sellers'),
    products: require('./resources/Products'),
    orders: require('./resources/Orders'),
    reports: require('./resources/Reports'),
    merchantFulfillment: require('./resources/MerchantFulfillment')
};

AmazonMws.AmazonMwsResource = require('./AmazonMwsResource');
AmazonMws.resources = resources;


function AmazonMws(accessKey, accessSecret, version) {
    if (!(this instanceof AmazonMws)) {
        return new AmazonMws(accessKey, accessSecret, version);
    }

    this._api = {
        auth: null,
        host: AmazonMws.DEFAULT_HOST,
        port: AmazonMws.DEFAULT_PORT,
        basePath: AmazonMws.DEFAULT_BASE_PATH,
        version: AmazonMws.DEFAULT_API_VERSION,
        timeout: AmazonMws.DEFAULT_TIMEOUT,
        agent: null,
        dev: false
    };

    if (!version) {
        version = '';
    }
    if (!accessKey) {
        accessKey = '';
    }
    if (!accessSecret) {
        accessSecret = '';
    }
    this._prepResources();
    this.setApiKey(accessKey, accessSecret);
    this.setApiVersion(version);
    this.setResponseFormat(AmazonMws.DEFAULT_RESPONSE_FORMAT);
}

AmazonMws.prototype = {

    setHost: function (host, port, protocol) {
        this._setApiField('host', host);
        if (port) {
            this.setPort(port);
        }
        if (protocol) {
            this.setProtocol(protocol);
        }
    },

    setProtocol: function (protocol) {
        this._setApiField('protocol', protocol.toLowerCase());
    },

    setPort: function (port) {
        this._setApiField('port', port);
    },

    setResponseFormat: function (format) {
        this._setApiField('format', format);
    },

    setApiVersion: function (version) {
        if (version) {
            this._setApiField('version', version);
        }
    },

    setApiKey: function (accessKey, accessSecret) {
        if (accessKey) {
            this._setApiField('key', accessKey);
        }
        if (accessSecret) {
            this._setApiField('secret', accessSecret);
        }
    },

    setTimeout: function (timeout) {
        this._setApiField('timeout', timeout === null ? AmazonMws.DEFAULT_TIMEOUT : timeout);
    },

    setHttpAgent: function (agent) {
        this._setApiField('agent', agent);
    },

    _setApiField: function (key, value) {
        this._api[key] = value;
    },

    getApiField: function (key) {
        return this._api[key];
    },

    getResponseFormat: function (key) {
        return this._api[key];
    },

    getConstant: function (c) {
        return AmazonMws[c];
    },

    _prepResources: function () {
        for (var name in resources) {
            this[name[0].toLowerCase() + name.substring(1)] = new resources[name](this);
        }
    },

    // Gets a JSON version of a User-Agent and uses a cached version for a slight
    // speed advantage.
    getClientUserAgent: function (cb) {
        if (AmazonMws.USER_AGENT_SERIALIZED) {
            return cb(AmazonMws.USER_AGENT_SERIALIZED);
        }
        this.getClientUserAgentSeeded(AmazonMws.USER_AGENT, function (cua) {
            AmazonMws.USER_AGENT_SERIALIZED = cua;
            cb(AmazonMws.USER_AGENT_SERIALIZED);
        });
    },

    // Gets a JSON version of a User-Agent by encoding a seeded object and
    // fetching a uname from the system.
    getClientUserAgentSeeded: function (seed, cb) {
        exec('uname -a', function (err, uname) {
            var userAgent = {};
            for (var field in seed) {
                userAgent[field] = encodeURIComponent(seed[field]);
            }

            // URI-encode in case there are unusual characters in the system's uname.
            userAgent.uname = encodeURIComponent(uname) || 'UNKNOWN';

            cb(JSON.stringify(userAgent));
        });
    }
};

module.exports = AmazonMws;

module.exports.AmazonMws = AmazonMws;
