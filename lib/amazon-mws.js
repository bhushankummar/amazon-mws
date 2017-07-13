'use strict';

Mws.DEFAULT_HOST = 'mws.amazonservices.com';
Mws.DEFAULT_PORT = '443';
Mws.DEFAULT_BASE_PATH = '/';
Mws.DEFAULT_RESPONSE_FORMAT = '.json';
Mws.DEFAULT_API_VERSION = null;

// Use node's default timeout:
Mws.DEFAULT_TIMEOUT = require('http').createServer().timeout;

Mws.PACKAGE_VERSION = require('../package.json').version;

Mws.USER_AGENT = {
    bindings_version: Mws.PACKAGE_VERSION,
    lang: 'node',
    lang_version: process.version,
    platform: process.platform,
    publisher: 'amazonservices',
    uname: null
};

Mws.USER_AGENT_SERIALIZED = null;

var exec = require('child_process').exec;

var resources = {
    sellers: require('./resources/Sellers')
};

Mws.AmazonMwsResource = require('./AmazonMwsResource');
Mws.resources = resources;


function Mws(environmentKey, accessSecret, version) {
    if (!(this instanceof Mws)) {
        return new Mws(environmentKey, accessSecret, version);
    }

    this._api = {
        auth: null,
        host: Mws.DEFAULT_HOST,
        port: Mws.DEFAULT_PORT,
        basePath: Mws.DEFAULT_BASE_PATH,
        version: Mws.DEFAULT_API_VERSION,
        timeout: Mws.DEFAULT_TIMEOUT,
        agent: null,
        dev: false
    };

    this._prepResources();
    this.setApiKey(environmentKey, accessSecret);
    this.setApiVersion(version);
    this.setResponseFormat(Mws.DEFAULT_RESPONSE_FORMAT);
}

Mws.prototype = {

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

    setApiKey: function (environmentKey, accessSecret) {
        if (environmentKey && accessSecret) {
            this._setApiField('key', environmentKey);
            this._setApiField('secret', accessSecret);
        }
    },

    setTimeout: function (timeout) {
        this._setApiField(
          'timeout',
          timeout === null ? Mws.DEFAULT_TIMEOUT : timeout
        );
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
        return Mws[c];
    },

    // Gets a JSON version of a User-Agent and uses a cached version for a slight
    // speed advantage.
    getClientUserAgent: function (cb) {
        if (Mws.USER_AGENT_SERIALIZED) {
            return cb(Mws.USER_AGENT_SERIALIZED);
        }
        this.getClientUserAgentSeeded(Mws.USER_AGENT, function (cua) {
            Mws.USER_AGENT_SERIALIZED = cua;
            cb(Mws.USER_AGENT_SERIALIZED);
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
    },

    _prepResources: function () {
        for (var name in resources) {
            this[
            name[0].toLowerCase() + name.substring(1)
              ] = new resources[name](this);
        }
    }
};

module.exports = Mws;

module.exports.Mws = Mws;
