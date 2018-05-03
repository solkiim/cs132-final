// post request
// get the bottom row of sell
// get the top row of buy
// and find the weightedPriceForPrices
// then insert into prices table

exports.getPrices = function(pool, req, res) {
	var sell = pool.query('SELECT LIMIT 1 * FROM Sell ORDER BY price DESC, timestamp DESC', function(err,data){
		
		if (err){
			console.error(err);
		}
		
		// get that bottom row's numtokens and posted price
		var tokenSymbol_sell = data.rows[0].tokenSymbol;
		var price_sell = data.rows[0].price;
		var numTokens_sell = data.rows[0].numTokens;
	});
	
	var buy = pool.query('SELECT LIMIT 1 * FROM Buy ORDER BY price, timestamp DESC', function(err,data){
		
		if (err){
			console.error(err);
		}
		
		// get that bottom row's numtokens and posted price
		var tokenSymbol_buy = data.rows[0].tokenSymbol;
		var price_buy = data.rows[0].price;
		var numTokens_buy = data.rows[0].numTokens;
	});
	
	var price = weightedforPriceTable(price_sell, price_buy, numTokens_sell, numTokens_buy);
	
	pool.query('INSERT INTO PriceHistory (tokenSymbol, tokenPrice) VALUES($1, $2)', [tokenSymbol_sell, price], function(error, data) {
		
		if (error){
			console.log("FAILED to add to database");
			res.sendStatus(500);
		}
		res.json();
		
	});
}

function weightedforPriceTable(sell_price, buy_price, sell_num, buy_num){
	var totaltokens = sell_num + buy_num;
	var sell_ratio = sell_num / total_tokens;
	var buy_ratio = buy_num / total_tokens;
	var w_price = sell_price * sell_ratio + buy_price * buy_ratio;
	return w_price;
}
