// ----------------------------------- SETUP -----------------------------------

// dependencies
const bcrypt = require('bcrypt');
var fs = require('fs');
var async = require('async');

// ----------------------------------- ROUTES ----------------------------------

exports.getorders = function(io, pool, req, res) {
	// get the lowest price sell
	pool.query('SELECT * FROM Sell ORDER BY price, timestamp_ LIMIT 100', function(err, data) {
		if(err) {
			console.error(err);
		}
		// res.json(data.rows);
	});

	// get the highest price buy
	pool.query('SELECT * FROM Buy ORDER BY price ASC, timestamp_ ASC LIMIT 100', function(err, data) {
		if(err) {
			console.error(err);
		}
		// res.json(data.rows);
	});

}

exports.marketsubmit = function(io, pool, req, res) {
	if (req.body.buyOrSell == 'buy'){
		executeMarketBuy(
			io,
			pool,
			res,
			req.body.buyOrSell,
			req.body.tokenSym,
			req.body.orderType,
			req.body.numTokens,
			req.body.username
		);
	} else if (req.body.buyOrSell == 'sell') {
		executeMarketSell(
			io,
			pool,
			res,
			req.body.buyOrSell,
			req.body.tokenSym,
			req.body.orderType,
			req.body.numTokens,
			req.body.username
		);
	}
}

exports.limitsubmit = function(io, pool, req, res) {
	if (req.body.buyOrSell == 'buy'){
		executeLimitBuy(
			io,
			pool,
			res,
			req.body.numTokens,
			req.body.price,
			req.body.tokenSym,
			req.body.buyOrSell,
			req.body.orderType,
			req.body.username
		);
	} else if (req.body.buyOrSell == 'sell'){
		executeLimitSell(
			io,
			pool,
			res,
			req.body.numTokens,
			req.body.price,
			req.body.tokenSym,
			req.body.buyOrSell,
			req.body.orderType,
			req.body.username
		);
	}
}

// ----------------------------- HELPER FUNCTIONS ------------------------------

function executeMarketBuy(io, pool, res, buyOrSell, tokenSym, orderType, reqNumTokens, username){
	var originalReqNumTokens = reqNumTokens;
	var reqTokens = reqNumTokens;
	
	// clear arrays each time you escape while loop
	var clearedPrices = [];
	var clearedNumTokens = [];
	var time;
		
	// don't run this function if no rows in Sell
	pool.query('SELECT * FROM Sell', function(err, data) {
		
		if (err) {
			console.error("no sell orders; cannot execute market buy");
		}
		
		if (data.rows.length == 0) {
			res.json("Error: not enough tokens on orderbook");
		} else {
			// until all trades are executed and sell table not empty
			async.whilst(
				function() { return reqTokens != 0; },
				function(callback) {
					// check lowest price entry in sell
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
									if(err){
										console.error(err);
									}
									callback();
								});

							// no delete from sell; just updating
							} else {
								if (rowTokens > reqTokens){
									// just insert the difference
									rowTokens = rowTokens - reqTokens;
								}
								reqTokens = 0;
								
								// you're finished
								clearedNumTokens.push(rowTokens);
								clearedPrices.push(rowSellPrice);

								pool.query("UPDATE Sell WHERE orderID=$1 SET numTokens=$2", [sellOrderID, rowTokens], function(error,data){
									if(error){
										console.error(err);
									}
									callback();
								});
							}
						}
					);
				},
				function (err) {
					var price = weightedPrice(clearedPrices, clearedNumTokens);
					var currenttime = Date.now();
				
					pool.query(
						'INSERT INTO Trades (tokenSymbol, orderType, numTokens, price, username, timestamp_) VALUES($1, $2, $3, $4, $5, $6)',
						[tokenSym, orderType, originalReqNumTokens, price, username, currenttime],
						function(error, data) {
							if (error){
								console.error("FAILED to add to database");
							}
							
							io.sockets.emit('clearOrder', "buy", data.lastInsertId);

							// emit trade graph socket
							io.sockets.emit('newTradeGraphPoint', tokenSym, currenttime, price);
				
						}
					);
				}
			);
		}
	});
}

function executeMarketSell(io, pool, res, buyOrSell, tokenSym, orderType, reqNumTokens, username){
	var originalReqNumTokens = reqNumTokens;
	var reqTokens = reqNumTokens;
	
	// clear arrays each time you escape while loop
	var clearedPrices = [];
	var clearedNumTokens = [];
	var time;
	
	// don't run this function if no rows in Sell
	pool.query('SELECT * FROM Buy', function(err, data) {
		if (err) {
			console.error(err);
		}

		if (data.rows.length == 0) {
			res.json("Error: not enough tokens on orderbook");
		} else {
			// until all trades are executed and sell table not empty
		async.whilst(
			function() { return reqTokens != 0; },
			function(callback) {
				// check highest price in sell
				pool.query(
					'SELECT * FROM Buy ORDER BY price ASC, timestamp_ ASC LIMIT 1',
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
							pool.query('DELETE FROM Buy WHERE orderID=$1', [sellOrderID], function(err,data){
								if(err){
									console.error(err);
								}
								callback();
							});

						// no delete from sell; just updating
						} else {
							if (rowTokens > reqTokens){
								// just insert the difference
								rowTokens = rowTokens - reqTokens;
							}
							reqTokens = 0;
							
							// you're finished
							clearedNumTokens.push(rowTokens);
							clearedPrices.push(rowSellPrice);
							
							// exposed to sql injection attacks
							// Update Sell bottom row SET numTokens = rowNumTokens;
							pool.query("UPDATE Buy WHERE orderID=$1 SET numTokens=$2", [sellOrderID, rowTokens], function(error,data){
								if(error){
									console.error(err);
								}
								callback();
							});
						}

					});
				},
				function (err) {
					var price = weightedPrice(clearedPrices, clearedNumTokens);
					var currenttime = Date.now();
				
					pool.query(
						'INSERT INTO Trades (tokenSymbol, orderType, numTokens, price, username, timestamp_) VALUES($1, $2, $3, $4, $5, $6)',
						[tokenSym, orderType, originalReqNumTokens, price, username, currenttime],
						function(error, data) {
							if (error){
								console.error(error);
							}
							io.sockets.emit('clearOrder', "sell", data.lastInsertId);
							// emit trade graph socket
							io.sockets.emit('newTradeGraphPoint', tokenSym, currenttime, price);
				
						}
					);
				}
			);
		}
	});
}

function executeLimitBuy(io, pool, res, reqTokens, price, tokenSym, buyOrSell, orderType, username){
	pool.query('SELECT * FROM Sell ORDER BY price, timestamp_ LIMIT 1', function(err,data){
		if (err){
			console.error(err);
		}
		// if buy order(s) exist
		if ((data.rows.length > 0) && (price >= data.rows[0].price)){
			// if limit sell -> on buy side; just a market sell
			executeMarketBuy(io, pool, buyOrSell, tokenSym, orderType, reqTokens, username);
		} else {
			// insert into the sell table
				pool.query('INSERT INTO Buy (tokenSymbol, orderType, numTokens, price, username, timestamp_) VALUES($1, $2, $3, $4, $5, $6)', [tokenSym, orderType, reqTokens, price, username, Date.now()], function(error, data) {
					if (error){
						console.error(err);
					}

					// need to also send ID
					io.sockets.emit('updateOrders', data.lastInsertId, tokenSym, Date.now(), buyOrSell, price, reqTokens);
				});
		}
		
	});
};

	function executeLimitSell(io, pool, res, reqTokens, price, tokenSym, buyOrSell, orderType, username){
		pool.query('SELECT * FROM Buy ORDER BY price DESC, timestamp_ LIMIT 1', function(err,data){
			if (err){
				console.error(err);
			}
			// if buy order(s) exist
			if ((data.rows.length > 0) && (price >= data.rows[0].price)){
				// if limit sell -> on buy side; just a market sell
				executeMarketSell(io, pool, buyOrSell, tokenSym, orderType, reqTokens, username);
			} else {
				// insert into the sell table
					pool.query('INSERT INTO Sell (tokenSymbol, orderType, numTokens, price, username, timestamp_) VALUES($1, $2, $3, $4, $5, $6)', [tokenSym, orderType, reqTokens, price, username, Date.now()], function(error, data) {
						if (error){
							console.error(error);
						}
						// trigger function updatingOrders
						io.sockets.emit('updateOrders', data.lastInsertId, tokenSym, Date.now(), buyOrSell, price, reqTokens);
					});
			}
			
		});
	};
	
	function weightedPrice(clearedPrices, clearedNumTokens){
		if (clearedPrices.length != clearedNumTokens.length){
			console.error("error; price & token lengths different");
		}
		
		var length = clearedPrices.length;
		var finalPrice = 0;
		var totalClearedNumTokens = 0;
		var ratio = 0;

		for (var i=0; i < length; i++){
			totalClearedNumTokens += clearedNumTokens[i];
		}
		
		// get total weighted final price
		for (var j=0; j < length; j++){
			ratio = clearedNumTokens[j] / totalClearedNumTokens;
			finalPrice += clearedPrices[j]*ratio;
		}
		
		return finalPrice;
	}
