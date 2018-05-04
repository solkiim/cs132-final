// ----------------------------------- SETUP -----------------------------------

// dependencies
const bcrypt = require('bcrypt');
var fs = require('fs');
var async = require('async');

// ----------------------------------- ROUTES ----------------------------------

exports.marketsubmit = function(io, pool, req, res) {
	// console.log(req.body.buyOrSell);
	if (req.body.buyOrSell == 'buy'){
		executeMarketBuy(
			io,
			pool,
			req.body.buyOrSell,
			req.body.tokenSym,
			req.body.orderType,
			req.body.numTokens,
			req.body.username
		);
	} else if (req.body.buyOrSell == 'sell') {
		// execute market sell
	}
}

exports.limitsubmit = function(io, pool, req, res) {
	console.log(req.body.buyOrSell);
	if (req.body.buyOrSell == 'buy'){
		executeLimitBuy(
			io,
			pool,
			req.body.numTokens,
			req.body.price,
			req.body.tokenSym,
			req.body.buyOrSell,
			req.body.orderType,
			req.body.username
		);
	} else if (req.body.buyOrSell == 'sell'){
		
	}
}

// ----------------------------- HELPER FUNCTIONS ------------------------------

// ----------------------------- HELPER FUNCTIONS ------------------------------

function executeMarketBuy(io, pool, buyOrSell, tokenSym, orderType, reqNumTokens, username){
	var originalReqNumTokens = reqNumTokens;
	var reqTokens = reqNumTokens;
	
	// clear arrays each time you escape while loop
	var clearedPrices = [];
	var clearedNumTokens = [];

	// don't run this function if no rows in Sell
	pool.query('WHERE EXISTS (SELECT * FROM Sell)', function(err, data) {

		if (err) {
			console.log("no sell orders; cannot execute market buy");
		}
		
		// until all trades are executed and sell table not empty
		async.whilst(
			function() { return reqTokens != 0; },
			function(callback) {
				// check last entry in sell (cheapest)
				pool.query(
					'SELECT * FROM Sell ORDER BY price DESC, timestamp_ DESC LIMIT 1',
					function(err,data) {
						if (err){
							console.error(err);
						}
						
						// get that bottom row's numtokens and posted price
						var sellOrderID = data.rows[0].orderID;
						var rowTokens = data.rows[0].numTokens;
						var rowSellPrice = data.rows[0].price;
						
						// meaning you'll need to keep climbing up
						if (rowTokens < reqTokens){
							// update however many tokens you still gotta clear
							reqTokens = reqTokens - rowTokens;
							
							clearedPrices.push(rowSellPrice);
							clearedNumTokens.push(rowTokens);
							
							// delete, since all tokens for that order have been cleared
							pool.query('DELETE from Sell by price DESC, timestamp DESC, LIMIT 1', function(err,data){
								if(err){
									console.error(err);
								}
							});
						} else if (rowTokens >= reqTokens){
							// if more tokens than you want
							
							// you're finished
							rowTokens = rowTokens - reqTokens;
							clearedPrices.push(rowSellPrice);
							clearedNumTokens.push(rowTokens);
							
							// exposed to sql injection attacks
							// Update Sell bottom row SET numTokens = rowNumTokens;
							pool.query("UPDATE Sell SET numTokens = '" + rowTokens, function(error,data){
								if(error){
									console.error(err);
								}
							});
							
							// actual price is the actually transacted price; the price can slip in a market order since it just depends on what orders are on the book
							var price = weightedPrice(clearedPrices, clearedNumTokens);
							
							// insert into trades history table
							pool.query('INSERT INTO Trades (tokenSym, buyOrSell, orderType, reqNumTokens, price, username) VALUES($1, $2, $3, $4, $5)', [tokenSym, buyOrSell, orderType, originalReqNumTokens, price, username], function(error, data) {
								if (error){
									console.log("FAILED to add to database");
								}
								// done; no more looping
								reqNumTokens = 0;
							});
						}
					});
				}
		);
	});
	
	// if Sell table is empty, post the market order as
	
	
}

function executeLimitBuy(io, pool, reqTokens, price, tokenSym, buyOrSell, orderType, username){
	
	var rowSellPrice;
	
	// if price exists on sell table, it is essentially a marketBuy
	// not clearing since sell is empty right now; so data is undefined
	// need another way to check
	pool.query("SELECT * FROM Sell WHERE price = $1", [price], function(error, data){
		
		if (error){
			console.log(error);
		}

		console.log(data)

		if (data.rows.length > 0){
			executeMarketBuy(io, pool, buyOrSell, tokenSym, orderType, reqTokens, username);
		
			return;
		}
		
	});
	
	// if exact price does not exist on sell
	pool.query("SELECT * FROM Sell WHERE price = $1", [price], function(error, data){

		if (error){
			console.log(error);
		}

		if (data.rows.length == 0) {
			// if that lowest price is  <= your price
			pool.query('SELECT * FROM Sell ORDER BY price, timestamp_ DESC LIMIT 1', function(err,data){
				
				if (err){
					console.log(err);
				}
				
				rowSellPrice = data.rows[0].price;
				
				if (rowSellPrice <= price){
					
					// insert into the sell table
					
					pool.query('INSERT INTO Sell (tokenSymbol, orderType, numTokens, price, username) VALUES($1, $2, $3, $4, $5)', [tokenSym, orderType, reqTokens, price, username], function(error, data) {
						
						if (error){
							console.log(err);
						}

						var time = new Date();
						
						// trigger function updatingOrders
						io.sockets.emit('updateOrders', time, buyOrSell, price, reqTokens);
						
					});
					
				}
				
			});
		}
	});
	
	pool.query('INSERT INTO Sell (tokenSymbol, orderType, numTokens, price, username) VALUES($1, $2, $3, $4, $5)', [tokenSym, orderType, reqTokens, price, username], function(error, data) {
		
		if (error){
			console.log(error);
		}
		
	});
	
};

function weightedPrice(clearedPrices, clearedNumTokens){
	if (clearedPrices.length != clearedNumTokens.length){
		console.log("error; price & token lengths different");
	}
	
	var length = clearedPrices.length;
	var finalPrice = 0;
	var totalClearedNumTokens = 0;
	var ratio = 0;
	
	// get total cleared tokens
	for (i=0; i< length-1 ; i++){
		totalClearedNumTokens += clearedNumTokens[i];
	}
	
	// get total weighted final price
	for (j=0; j < length-1; j++){
		ratio = clearedNumTokens[j] / totalClearedNumTokens;
		finalPrice += clearedPrices[j]*ratio;
	}
	
	return finalPrice;
}
