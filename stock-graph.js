exports.getPrices = function(pool, req, res) {

	var sell_p;
	var buy_p;
	var num_sell;
	var num_buy;

	var sell = pool.query('SELECT * FROM Sell WHERE tokenSymbol=$1 ORDER BY price DESC, timestamp_ DESC', [req.body.current_token], function(err,data){

		if (err){
			console.error(err);
		}
		// get that bottom row's numtokens and posted price
		sell_p = data.rows[0].price;
		// sell_p = price_sell;
		num_sell  = data.rows[0].numTokens;
		// num_sell = numTokens_sell;
	});

	var buy = pool.query('SELECT * FROM Buy WHERE tokenSymbol=$1 ORDER BY price DESC, timestamp_ DESC', [req.body.current_token], function(err,data){

		if (err){
			console.error(err);
		}

		// get that bottom row's numtokens and posted price
		buy_p = data.rows[0].price;
		// buy_p = price_buy;
		num_buy= data.rows[0].numTokens;
		// num_buy = numTokens_buy;
	});

	var price = weightedforPriceTable(sell_p, buy_p, num_sell, num_buy);

	pool.query('INSERT INTO PriceHistory (tokenSymbol, tokenPrice) VALUES($1, $2)', [req.body.current_token, price], function(err, data) {

		if (err){
			console.log("FAILED to add to database");
			res.sendStatus(500);
		}
	});

	pool.query('SELECT * from PriceHistory WHERE tokenSymbol = $1 ORDER by timestamp_ DESC', [req.body.current_token], function(err, data) {
		console.log(data)

		res.json({prices: data.rows.map(item => item.tokenPrice), times: data.rows.map(item => item.timestamp_)});
	});

	function weightedforPriceTable(sell_price, buy_price, sell_num, buy_num){
		var totaltokens = sell_num + buy_num;
		var sell_ratio = sell_num / totaltokens;
		var buy_ratio = buy_num / totaltokens;
		var w_price = sell_price * sell_ratio + buy_price * buy_ratio;
		return w_price;
	}
}
