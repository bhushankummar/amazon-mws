'use strict';

var qs = require('qs');
var hasOwn = {}.hasOwnProperty;
var _ = require('lodash');

var utils = module.exports = {

    isAuthKey: function (key) {
        return typeof key === 'string' && /^(?:[a-z]{2}_)?[A-z0-9]{32}$/.test(key);
    },

    isOptionsHash: function (o) {
        return _.isPlainObject(o) && ['api_key'].some(function (key) {
            return Object.prototype.hasOwnProperty.call(o, key);
        });
    },

    /**
     * Stringifies an Object, accommodating nested objects
     * (forming the conventional key 'parent[child]=value')
     */
    stringifyRequestData: function (data) {
        return qs.stringify(data, { arrayFormat: 'brackets' });
    },

    /**
     * Outputs a new function with interpolated object property values.
     * Use like so:
     *   var fn = makeURLInterpolator('some/url/{param1}/{param2}');
     *   fn({ param1: 123, param2: 456 }); // => 'some/url/123/456'
     */
    makeURLInterpolator: (function () {
        var rc = {
            '\n': '\\n',
            '"': '\\"',
            '\u2028': '\\u2028',
            '\u2029': '\\u2029'
        };
        return function makeURLInterpolator (str) {
            var cleanString = str.replace(/["\n\r\u2028\u2029]/g, function ($0) {
                return rc[$0];
            });
            return function (outputs) {
                return cleanString.replace(/\{([\s\S]+?)\}/g, function ($0, $1) {
                    return encodeURIComponent(outputs[$1] || '');
                });
            };
        };
    }()),

    /**
     * Return the data argument from a list of arguments
     */
    getDataFromArgs: function (args) {
        if (args.length > 0) {
            if (_.isPlainObject(args[0]) && !utils.isOptionsHash(args[0])) {
                return args.shift();
            }
        }
        return {};
    },

    /**
     * Return the options hash from a list of arguments
     */
    getOptionsFromArgs: function (args) {
        var opts = {
            auth: null,
            headers: {}
        };
        if (args.length > 0) {
            var arg = args[args.length - 1];
            if (utils.isAuthKey(arg)) {
                opts.auth = args.pop();
            }
        }
        return opts;
    },

    /**
     * Provide simple "Class" extension mechanism
     */
    protoExtend: function (sub) {
        var Super = this;
        var Constructor = hasOwn.call(sub, 'constructor') ? sub.constructor : function () {
            Super.apply(this, arguments);
        };
        Constructor.prototype = Object.create(Super.prototype);
        for (var i in sub) {
            if (hasOwn.call(sub, i)) {
                Constructor.prototype[i] = sub[i];
            }
        }
        for (i in Super) {
            if (hasOwn.call(Super, i)) {
                Constructor[i] = Super[i];
            }
        }
        return Constructor;
    },

    /**
     * Convert an array into an object with integer string attributes
     */
    arrayToObject: function (arr) {
        if (Array.isArray(arr)) {
            const obj = {};
            arr.forEach(function (item, i) {
                obj[i.toString()] = item;
            });
            return obj;
        }
        return arr;
    }

};
