'use strict';
var config = require('../intialize/config');
var accessKey = config.accessKey;
var accessSecret = config.accessSecret;

var chai = require('chai');
var expect = chai.expect;

var amazonMws = require('../../lib/amazon-mws')(accessKey, accessSecret);

describe('Orders', function () {

    before(function () {
        expect(accessKey).to.be.a('string');
        expect(accessSecret).to.be.a('string');
    });

    it('It should get list of orders using ListOrders Action', async function () {
        var options = {
            'Version': '2013-09-01',
            'Action': 'ListOrders',
            'SellerId': config.SellerId,
            'MWSAuthToken': config.MWSAuthToken,
            'MarketplaceId.Id.1': config.MarketplaceId,
            'LastUpdatedAfter': new Date(13, 12, 2016)
        };
        expect(options.SellerId).to.be.a('string');
        expect(options.MWSAuthToken).to.be.a('string');
        expect(options['MarketplaceId.Id.1']).to.be.a('string');

        var response = await amazonMws.orders.search(options);

        expect(response).to.be.a('object');
        expect(response).to.have.property('Orders').to.be.a('object');
        expect(response).to.have.property('ResponseMetadata').to.be.a('object');
        expect(response).to.have.property('ResponseMetadata').to.have.property('RequestId');
        expect(response).to.have.property('Headers').to.be.a('object');
        expect(response).to.have.property('Headers').to.have.property('x-mws-quota-max');
        expect(response).to.have.property('Headers').to.have.property('x-mws-quota-remaining');
        expect(response).to.have.property('Headers').to.have.property('x-mws-quota-resetson');
        expect(response).to.have.property('Headers').to.have.property('x-mws-timestamp');
    });
});