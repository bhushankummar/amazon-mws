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
describe('Products', function () {

    before(function () {
        expect(accessKey).to.be.a('string');
        expect(accessSecret).to.be.a('string');
    });

    it('It should get offers using ListMatchingProducts Action', async function () {
        var options = {
            'Version': '2011-10-01',
            'Action': 'ListMatchingProducts',
            'SellerId': config.SellerId,
            'MarketplaceId': config.MarketplaceId,
            'Query': 'k'
        };
        expect(options.SellerId).to.be.a('string');
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
            'MarketplaceId': config.MarketplaceId,
            'ASIN': config.ASIN,
            'ItemCondition': 'New'
        };
        expect(options.SellerId).to.be.a('string');
        expect(options.MarketplaceId).to.be.a('string');
        expect(options.ASIN).to.be.a('string');

        var response = await amazonMws.products.searchFor(options);
        console.log('response ', JSON.stringify(response, null, 2));
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

    it('It should get my price for ASIN using getMyPriceForASIN Action', async function () {
        var options = {
            'Version': '2011-10-01',
            'Action': 'GetMyPriceForASIN',
            'SellerId': config.SellerId,
            'MarketplaceId': config.MarketplaceId,
            'ASINList.ASIN.1': config.ASIN
        };
        expect(options.SellerId).to.be.a('string');
        expect(options.MarketplaceId).to.be.a('string');
        expect(options[ 'ASINList.ASIN.1' ]).to.be.a('string');

        try {
            var response = await amazonMws.products.searchFor(options);
            expect(response).to.be.a('object');
            expect(response).to.have.property('ASIN').to.be.a('string');
            expect(response).to.have.property('status').to.be.a('string');
            expect(response).to.have.property('Product').to.be.a('object');
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

    it('It should NOT get my price for INVALID ASIN using GetMyPriceForASIN Action', async function () {
        var options = {
            'Version': '2011-10-01',
            'Action': 'GetMyPriceForASIN',
            'SellerId': config.SellerId,
            'MarketplaceId': config.MarketplaceId,
            'ASINList.ASIN.1': undefined
        };
        expect(options.SellerId).to.be.a('string');
        expect(options.MarketplaceId).to.be.a('string');

        try {
            var response = await amazonMws.products.searchFor(options);
            expect(response).to.be.a('object');
            expect(response).to.have.property('ASIN').to.be.a('string');
            expect(response).to.have.property('status').to.be.a('string');
            expect(response).to.have.property('Product').to.be.a('object');
            expect(response).to.have.property('ResponseMetadata').to.be.a('object');
            expect(response).to.have.property('ResponseMetadata').to.have.property('RequestId');
            expect(response).to.have.property('Headers').to.be.a('object');
            expect(response).to.have.property('Headers').to.have.property('x-mws-quota-max');
            expect(response).to.have.property('Headers').to.have.property('x-mws-quota-remaining');
            expect(response).to.have.property('Headers').to.have.property('x-mws-quota-resetson');
            expect(response).to.have.property('Headers').to.have.property('x-mws-timestamp');
        } catch (error) {
            console.log('error ', error);
            expect(error).to.be.a('object');
            expect(error).to.have.property('Type').to.be.a('string');
            expect(error).to.have.property('Message').to.be.a('string');
            // expect(error).to.have.property('Detail').to.be.a('object');
            expect(error).to.have.property('StatusCode').to.be.a('number');
            expect(error).to.have.property('RequestId').to.be.a('string');
            expect(error).to.have.property('Headers').to.be.a('object');
            expect(error).to.have.property('Headers').to.have.property('x-mws-quota-max');
            expect(error).to.have.property('Headers').to.have.property('x-mws-quota-remaining');
            expect(error).to.have.property('Headers').to.have.property('x-mws-quota-resetson');
            expect(error).to.have.property('Headers').to.have.property('x-mws-timestamp');
        }

    });


    it('It should get my price for ASIN using GetCompetitivePricingForASIN Action', async function () {
        var options = {
            'Version': '2011-10-01',
            'Action': 'GetCompetitivePricingForASIN',
            'SellerId': config.SellerId,
            'MarketplaceId': config.MarketplaceId,
            'ASINList.ASIN.1': config.ASIN
        };
        expect(options.SellerId).to.be.a('string');
        expect(options.MarketplaceId).to.be.a('string');
        expect(options[ 'ASINList.ASIN.1' ]).to.be.a('string');

        try {
            var response = await amazonMws.products.searchFor(options);
            expect(response).to.be.a('object');
            expect(response).to.have.property('ASIN').to.be.a('string');
            expect(response).to.have.property('status').to.be.a('string');
            expect(response).to.have.property('Product').to.be.a('object');
            expect(response).to.have.property('Product').to.have.property('CompetitivePricing');
            if (response.Product.CompetitivePricing.NumberOfOfferListings.OfferListingCount) {
                expect(response).to.have.property('Product').to.have.property('CompetitivePricing').to.have.property('NumberOfOfferListings');
                expect(response).to.have.property('Product').to.have.property('CompetitivePricing').to.have.property('NumberOfOfferListings').to.have.property('OfferListingCount').to.be.a('array');
                expect(response.Product.CompetitivePricing.NumberOfOfferListings.OfferListingCount[ 0 ]).to.have.property('condition');
                expect(response.Product.CompetitivePricing.NumberOfOfferListings.OfferListingCount[ 0 ]).to.have.property('Value');
            }
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
