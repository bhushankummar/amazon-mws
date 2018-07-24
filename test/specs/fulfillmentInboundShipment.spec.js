'use strict';
var config = require('../intialize/config');
var accessKey = config.accessKey;
var accessSecret = config.accessSecret;

var chai = require('chai');
var expect = chai.expect;

var amazonMws = require('../../lib/amazon-mws')(accessKey, accessSecret);

describe('Fulfillment Inbound Shipment', function () {

    before(function () {
        expect(accessKey).to.be.a('string');
        expect(accessSecret).to.be.a('string');
    });

    it('It should get Inbound Guidance For SKU using GetInboundGuidanceForSKU Action', async function () {
        var options = {
            'Version': '2010-10-01',
            'Action': 'GetInboundGuidanceForSKU',
            'SellerId': config.SellerId,
            'MWSAuthToken': config.MWSAuthToken,
            'MarketplaceId': config.MarketplaceId,
            'SellerSKUList.Id.1': config.SKU
        };

        console.log('options ', options);
        expect(options.SellerId).to.be.a('string');
        expect(options.MWSAuthToken).to.be.a('string');
        expect(options.MarketplaceId).to.be.a('string');
        expect(options['SellerSKUList.Id.1']).to.be.a('string');

        var response = await amazonMws.fulfillmentInboundShipment.search(options);

        expect(response).to.be.a('object');
        expect(response).to.have.property('SKUInboundGuidanceList').to.be.a('object');
        expect(response).to.have.property('ResponseMetadata').to.be.a('object');
        expect(response).to.have.property('ResponseMetadata').to.have.property('RequestId');
        expect(response).to.have.property('Headers').to.be.a('object');
        expect(response).to.have.property('Headers').to.have.property('x-mws-quota-max');
        expect(response).to.have.property('Headers').to.have.property('x-mws-quota-remaining');
        expect(response).to.have.property('Headers').to.have.property('x-mws-quota-resetson');
        expect(response).to.have.property('Headers').to.have.property('x-mws-timestamp');
    });
});