describe("Trading", function() {
var request = require('request');
var server = require('../../server.js');
var base_url = "http://localhost:8080/";

// verify password
describe("POST /marketsubmit", function() {

	it("returns status code 200", function(done) {
		params = {
			url: base_url + 'limitsubmit',
			form: {
			req.body.numTokens: '1',
			req.body.tokenSym: 'Uber',
			req.body.buyOrSell: 'sell',
			req.body.orderType: 'market',
			req.body.username: 'testing'
			}
		};

	request.post(params, function(error, response, body) {
		expect(response.statusCode).toBe(200);
		done();
	});

});


describe("POST /limitsubmit", function() {

	it("returns status code 200", function(done) {
		params = {
			url: base_url + 'limitsubmit',
			form: {
			req.body.numTokens: '1',
			req.body.price: '40',
			req.body.tokenSym: 'Uber',
			req.body.buyOrSell: 'sell',
			req.body.orderType: 'limit',
			req.body.username: 'testing'
			}
		};

	request.post(params, function(error, response, body) {
		expect(response.statusCode).toBe(200);
		done();
	});
});

describe("weightedPrice", function(){
	var prices, numTokens;

	beforeEach(function() {
		prices = [5, 1];
		numTokens = [10, 15];
	});

	it("logic is working", function(done) {
		expect(weightedPrice(prices,numTokens)).toEqual(2.6);
	});
});


