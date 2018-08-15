'use strict';
var config = require('../intialize/config');
var accessKey = config.accessKey;
var accessSecret = config.accessSecret;

var chai = require('chai');
var expect = chai.expect;

var amazonMws = require('../../lib/amazon-mws')(accessKey, accessSecret);

describe('Finances', function () {

    before(function () {
        expect(accessKey).to.be.a('string');
        expect(accessSecret).to.be.a('string');
    });

    it('It should get list of Financial Event Groups using ListFinancialEventGroups Action', async function () {
        var options = {
            'Version': '2015-05-01',
            'Action': 'ListFinancialEventGroups',
            'SellerId': config.SellerId,
            'MWSAuthToken': config.MWSAuthToken,
            'FinancialEventGroupStartedAfter': new Date(13, 12, 2016)
        };

        expect(options.SellerId).to.be.a('string');
        expect(options.MWSAuthToken).to.be.a('string');

        var response = await amazonMws.finances.search(options);

        expect(response).to.be.a('object');
        expect(response).to.have.property('FinancialEventGroupList').to.be.a('object');
        expect(response).to.have.property('ResponseMetadata').to.be.a('object');
        expect(response).to.have.property('ResponseMetadata').to.have.property('RequestId');
        expect(response).to.have.property('Headers').to.be.a('object');
        expect(response).to.have.property('Headers').to.have.property('x-mws-quota-max');
        expect(response).to.have.property('Headers').to.have.property('x-mws-quota-remaining');
        expect(response).to.have.property('Headers').to.have.property('x-mws-quota-resetson');
        expect(response).to.have.property('Headers').to.have.property('x-mws-timestamp');
    });
});