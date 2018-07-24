'use strict';
var config = require('../intialize/config');
var accessKey = config.accessKey;
var accessSecret = config.accessSecret;

var chai = require('chai');
var expect = chai.expect;

var amazonMws = require('../../lib/amazon-mws')(accessKey, accessSecret);

describe('Products', function () {

    before(function () {
        expect(accessKey).to.be.a('string');
        expect(accessSecret).to.be.a('string');
    });

    it('It should get offers using GetLowestPricedOffersForASIN Action', async function () {
        var options = {
            'Version': '2011-10-01',
            'Action': 'ListMatchingProducts',
            'SellerId': config.SellerId,
            'MWSAuthToken': config.MWSAuthToken,
            'MarketplaceId': config.MarketplaceId,
            'Query': 'k'
        };
        expect(options.SellerId).to.be.a('string');
        expect(options.MWSAuthToken).to.be.a('string');
        expect(options.MarketplaceId).to.be.a('string');

        var response = await amazonMws.products.searchFor(options);

        expect(response).to.be.a('object');
        expect(response).to.have.property('Products').to.be.a('object');
        expect(response).to.have.property('Products').to.have.property('Product');
        expect(response).to.have.property('ResponseMetadata').to.be.a('object');
        expect(response).to.have.property('ResponseMetadata').to.have.property('RequestId');
        expect(response).to.have.property('Headers').to.be.a('object');
        expect(response).to.have.property('Headers').to.have.property('x-mws-quota-max');
        expect(response).to.have.property('Headers').to.have.property('x-mws-quota-remaining');
        expect(response).to.have.property('Headers').to.have.property('x-mws-quota-resetson');
        expect(response).to.have.property('Headers').to.have.property('x-mws-timestamp');
    });

    it('It should get offers using GetLowestPricedOffersForASIN Action', async function () {
        var options = {
            'Version': '2011-10-01',
            'Action': 'GetLowestPricedOffersForASIN',
            'SellerId': config.SellerId,
            'MWSAuthToken': config.MWSAuthToken,
            'MarketplaceId': config.MarketplaceId,
            'ASIN': config.ASIN,
            'ItemCondition': 'New'
        };
        expect(options.SellerId).to.be.a('string');
        expect(options.MWSAuthToken).to.be.a('string');
        expect(options.MarketplaceId).to.be.a('string');
        expect(options.ASIN).to.be.a('string');

        var response = await amazonMws.products.searchFor(options);

        expect(response).to.be.a('object');
        expect(response).to.have.property('status').to.be.a('string');
        expect(response).to.have.property('Summary').to.be.a('object');
        expect(response).to.have.property('ResponseMetadata').to.be.a('object');
        expect(response).to.have.property('ResponseMetadata').to.have.property('RequestId');
        expect(response).to.have.property('Headers').to.be.a('object');
        expect(response).to.have.property('Headers').to.have.property('x-mws-quota-max');
        expect(response).to.have.property('Headers').to.have.property('x-mws-quota-remaining');
        expect(response).to.have.property('Headers').to.have.property('x-mws-quota-resetson');
        expect(response).to.have.property('Headers').to.have.property('x-mws-timestamp');
    });
});