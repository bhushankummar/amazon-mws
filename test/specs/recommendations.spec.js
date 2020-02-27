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
describe('Recommendations', function () {

    before(function () {
        expect(accessKey).to.be.a('string');
        expect(accessSecret).to.be.a('string');
    });

    it('It should list of recommendations using ListRecommendations Action', async function () {
        var options = {
            'Version': '2013-04-01',
            'Action': 'ListRecommendations',
            'SellerId': config.SellerId,
            'MarketplaceId': config.MarketplaceId,
            'CategoryQueryList.CategoryQuery.1.FilterOptions.FilterOption.1': 'QualitySet=Defect',
            'CategoryQueryList.CategoryQuery.1.FilterOptions.FilterOption.2': 'ListingStatus=Active',
            'CategoryQueryList.CategoryQuery.1.RecommendationCategory': 'ListingQuality'
        };
        expect(options.SellerId).to.be.a('string');
        expect(options.MarketplaceId).to.be.a('string');

        try {
            var response = await amazonMws.recommendations.searchFor(options);
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
