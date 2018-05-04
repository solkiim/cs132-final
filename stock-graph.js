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

					callback(null, {sell_p: data.rows.map(sell => sell.price), num_sell: data.rows.map(sell => sell.numTokens)});
				}
			);
		},
		buy: function(callback){
			pool.query('SELECT * FROM Buy WHERE tokenSymbol=$1 ORDER BY price DESC, timestamp_ DESC', [req.body.current_token], function(err,data){
				if (err){
					console.error("error buy query");
				}
				// console.log(data);

				// get that bottom row's numtokens and posted price
				callback(null, {buy_p: data.rows.map(buy => buy.price), num_buy: data.rows.map(buy => buy.numTokens)});
				// console.log(buy_p);
			});
		}
	}, function(err, results) {


		console.log(results.sell.sell_p);
		console.log(results.buy.buy_p);
		console.log(results.sell.num_sell);
		console.log(results.buy.num_buy);

		for (var i = 0; i < results.sell.sell_p.length; i++) {

		var price = weightedforPriceTable(results.sell.sell_p[i], results.buy.buy_p[i], results.sell.num_sell[i], results.buy.num_buy[i]);

		console.log(price);

		pool.query('INSERT INTO PriceHistory (tokenSymbol, tokenPrice, timestamp_) VALUES($1, $2, $3)', [req.body.current_token, price, Date.now()],
		function(err, data) {
			console.log('hi')
			if (err){
				console.log("FAILED to add to database");
				res.sendStatus(500);
			}
		});
	}

		pool.query('DELETE FROM PriceHistory');

		pool.query('SELECT * from PriceHistory WHERE tokenSymbol = $1 ORDER by timestamp_ DESC', [req.body.current_token],
		function(err, data) {
			// console.log(data);
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
