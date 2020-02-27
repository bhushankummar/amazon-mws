'use strict';
var config = require('../intialize/config');
var accessKey = config.accessKey;
var accessSecret = config.accessSecret;

var chai = require('chai');
var expect = chai.expect;

var amazonMws = require('../../lib/amazon-mws')(accessKey, accessSecret);
if (config.Host) {
    amazonMws.setHost(config.Host);
}
describe('Subscriptions', function () {

    before(function () {
        expect(accessKey).to.be.a('string');
        expect(accessSecret).to.be.a('string');
    });

    it('It should list of subscriptions using ListSubscriptions Action', async function () {
        var options = {
            'Version': '2013-07-01',
            'Action': 'ListSubscriptions',
            'SellerId': config.SellerId,
            'MarketplaceId': config.MarketplaceId
        };
        expect(options.SellerId).to.be.a('string');
        expect(options.MarketplaceId).to.be.a('string');

        try {
            var response = await amazonMws.subscriptions.searchFor(options);
            expect(response).to.be.a('object');
            expect(response).to.have.property('ResponseMetadata').to.be.a('object');
            expect(response).to.have.property('ResponseMetadata').to.have.property('RequestId');
            expect(response).to.have.property('Headers').to.be.a('object');
            expect(response).to.have.property('Headers').to.have.property('x-mws-quota-max');
            expect(response).to.have.property('Headers').to.have.property('x-mws-quota-remaining');
            expect(response).to.have.property('Headers').to.have.property('x-mws-quota-resetson');
            expect(response).to.have.property('Headers').to.have.property('x-mws-timestamp');
        } catch (error) {
            console.log('error ', error);
            expect(error).to.be.undefined;
        }
    });

});
