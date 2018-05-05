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

function executeMarketBuy(io, pool, buyOrSell, tokenSym, orderType, reqNumTokens, username){
	var originalReqNumTokens = reqNumTokens;
	var reqTokens = reqNumTokens;
	
	// clear arrays each time you escape while loop
	var clearedPrices = [];
	var clearedNumTokens = [];
	var time;
	
	// don't run this function if no rows in Sell
	pool.query('SELECT * FROM Sell', function(err, data) {
		
		if (err) {
			console.log("no sell orders; cannot execute market buy");
		}

		if (data.rows) {
			// until all trades are executed and sell table not empty
		async.whilst(
			function() { return reqTokens != 0; },
			function(callback) {
				// check last entry in sell (cheapest)
				pool.query(
					'SELECT * FROM Sell ORDER BY price, timestamp_ LIMIT 1',
					function(err,data) {
						if (err){
							console.error(err);
						}
						
						// get that bottom row's numtokens and posted price
						var sellOrderID = data.rows[0].orderID;
						var rowTokens = data.rows[0].numTokens;
						var rowSellPrice = data.rows[0].price;

						// climb up OR clear
						if (rowTokens <= reqTokens){
							// update however many tokens you still gotta clear
							reqTokens = reqTokens - rowTokens;
							
							clearedPrices.push(rowSellPrice);
							// cleared all the row's tokens
							clearedNumTokens.push(rowTokens);

							// delete, since all tokens for that order have been cleared

							pool.query('DELETE FROM Sell WHERE orderID=$1', [sellOrderID], function(err,data){
								console.log("DELETING");
								
								if(err){
									console.error(err);
								}
							});

							// if new reqTokens is now 0, done
							if (reqTokens == 0){
								var price = weightedPrice(clearedPrices, clearedNumTokens);
								console.log("price");
								console.log(price);
								var currenttime = Date.now();
							
								pool.query(
									'INSERT INTO Trades (tokenSymbol, orderType, numTokens, price, username, timestamp_) VALUES($1, $2, $3, $4, $5, $6)',
									[tokenSym, orderType, originalReqNumTokens, price, username, currenttime],
									function(error, data) {
										if (error){
											console.log("FAILED to add to database");
										}
										
										// emit trade graph socket
										io.sockets.emit('newTradeGraphPoint', tokenSym, currenttime, price);

									}
								);
							}

						// no delete from sell; just updating
						} else if (rowTokens > reqTokens){
							
							if (rowTokens > reqTokens){
								// just insert the difference
								rowTokens = rowTokens - reqTokens;
							}
							
							// you're finished
							clearedNumTokens.push(rowTokens);
							clearedPrices.push(rowSellPrice);
							
							// exposed to sql injection attacks
							// Update Sell bottom row SET numTokens = rowNumTokens;
							pool.query("UPDATE Sell WHERE orderID=$1 SET numTokens=$2", [sellOrderID, rowTokens], function(error,data){
								if(error){
									console.error(err);
								}
							});
							
							// actual price is the actually transacted price; the price can slip in a market order since it just depends on what orders are on the book
							var price = weightedPrice(clearedPrices, clearedNumTokens);
							var currenttime = Date.now();
							
							pool.query(
								'INSERT INTO Trades (tokenSymbol, orderType, numTokens, price, username, timestamp_) VALUES($1, $2, $3, $4, $5, $6)',
								[tokenSym, orderType, originalReqNumTokens, price, username, currenttime],
								function(error, data) {
									if (error){
										console.log("FAILED to add to database");
									}
									
									// emit trade graph socket
									io.sockets.emit('newTradeGraphPoint', tokenSym, currenttime, price);
									
									// done; no more looping
									reqNumTokens = 0;

								}
							);
						}

					});
				}
			);

			// if Sell table is empty, post the market order as
		}		
		});
	}
	
	function executeLimitBuy(io, pool, reqTokens, price, tokenSym, buyOrSell, orderType, username){
		pool.query('SELECT * FROM Sell ORDER BY price, timestamp_ LIMIT 1', function(err,data){
			if (err){
				console.error(err);
			}
			// if Sell order(s) exist
			if (data.rows.length > 0){
				// if limit buy -> on sell side; just a market buy
				if (price >= data.rows[0].price) {
					executeMarketBuy(io, pool, buyOrSell, tokenSym, orderType, reqTokens, username);
					// if limit buy -> on buy side; just post an order
				} else {
					// insert into the sell table
					pool.query('INSERT INTO Sell (tokenSymbol, orderType, numTokens, price, username, timestamp_) VALUES($1, $2, $3, $4, $5, $6)', [tokenSym, orderType, reqTokens, price, username, time], function(error, data) {
						if (error){
							console.log(err);
						}
						// trigger function updatingOrders
						io.sockets.emit('updateOrders', tokenSym, Date.now(), buyOrSell, price, reqTokens);
					});
				}
			} else {
				console.log("CANNOT PLACE LIMIT BUY: no sell order yet");
				return;
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

		totalClearedNumTokens = clearedPrices.reduce(function(acc, val) { return acc + val; });
		
		// get total weighted final price
		for (j=0; j < length; j++){
			ratio = clearedNumTokens[j] / totalClearedNumTokens;
			finalPrice = finalPrice + clearedPrices[j]*ratio;
		}
		
		return finalPrice;
	}
