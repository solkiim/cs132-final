// ----------------------------------- SETUP -----------------------------------

var async = require('async');

// ----------------------------------- GRAPH -----------------------------------

exports.getPrices = function(pool, req, res) {
	async.series({
		sell: function(callback) {
			pool.query(
				'SELECT * FROM Sell WHERE tokenSymbol=$1 ORDER BY price DESC, timestamp_ DESC',
				[req.body.current_token],
				function(err, data){
					if (err){
						console.error(err);
					}
					// get that bottom row's numtokens and posted price
					callback(null, {sell_p: data.rows[0].price, num_sell: data.rows[0].numTokens});
				}
			);
		},
		buy: function(callback){
			pool.query('SELECT * FROM Buy WHERE tokenSymbol=$1 ORDER BY price DESC, timestamp_ DESC', [req.body.current_token], function(err,data){
				if (err){
					console.error("error buy query");
				}
				
				// get that bottom row's numtokens and posted price
				callback(null, {buy_p: data.rows[0].price, num_buy: data.rows[0].numTokens});
			});
		}
	}, function(err, results) {
		var price = weightedforPriceTable(results.sell.sell_p, results.buy.buy_p, results.sell.num_sell, results.buy.num_buy);
				
		pool.query('INSERT INTO PriceHistory (tokenSymbol, tokenPrice, timestamp_) VALUES($1, $2, $3)', [req.body.current_token, price, Date.now()],
		function(err, data) {
			// console.log(data)
			if (err){
				console.log("FAILED to add to database");
				res.sendStatus(500);
			}
		});

		pool.query('SELECT * from PriceHistory WHERE tokenSymbol = $1 ORDER by timestamp_ DESC', [req.body.current_token],
		function(err, data) {
			var prices = [];
			var times = [];
			res.json({prices: data.rows.map(item => item.tokenPrice), times: data.rows.map(item => item.timestamp_)});
		});
	});
}

function weightedforPriceTable(sell_price, buy_price, sell_num, buy_num){
	var totaltokens = sell_num + buy_num;
	var sell_ratio = sell_num / totaltokens;
	var buy_ratio = buy_num / totaltokens;
	var w_price = sell_price * sell_ratio + buy_price * buy_ratio;
	return w_price;
}
