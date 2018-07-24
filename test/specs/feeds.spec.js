'use strict';
var config = require('../intialize/config');
var accessKey = config.accessKey;
var accessSecret = config.accessSecret;

var chai = require('chai');
var expect = chai.expect;

var amazonMws = require('../../lib/amazon-mws')(accessKey, accessSecret);

describe('Feeds', function () {

    before(function () {
        expect(accessKey).to.be.a('string');
        expect(accessSecret).to.be.a('string');
    });

    it('It should get Feed Submission list using GetFeedSubmissionList Action', async function () {
        var options = {
            'Version': '2009-01-01',
            'Action': 'GetFeedSubmissionList',
            'SellerId': config.SellerId,
            'MWSAuthToken': config.MWSAuthToken
        };

        expect(options.SellerId).to.be.a('string');
        expect(options.MWSAuthToken).to.be.a('string');

        var response = await amazonMws.feeds.search(options);

        expect(response).to.be.a('object');
        expect(response).to.have.property('FeedSubmissionInfo').to.be.a('array');
        expect(response).to.have.property('ResponseMetadata').to.be.a('object');
        expect(response).to.have.property('ResponseMetadata').to.have.property('RequestId');
        expect(response).to.have.property('Headers').to.be.a('object');
        expect(response).to.have.property('Headers').to.have.property('x-mws-quota-max');
        expect(response).to.have.property('Headers').to.have.property('x-mws-quota-remaining');
        expect(response).to.have.property('Headers').to.have.property('x-mws-quota-resetson');
        expect(response).to.have.property('Headers').to.have.property('x-mws-timestamp');
    });
});