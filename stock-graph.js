exports.getPrices = function(pool, req, res) {
	pool.query(
		'SELECT price, timestamp_ FROM Trades WHERE tokenSymbol=$1 ORDER BY timestamp_ DESC LIMIT 25',
		[req.body.current_token],
		function(err,data){
			if (err){
				console.error(err);
			}
			// flip for ascending time
			data.rows = data.rows.reverse();

			res.json({prices: data.rows.map(trade => trade.price), times: data.rows.map(trade => trade.timestamp_)});
		}
	);
}


exports.getPercentage = function(pool, req, res) {
	pool.query(
		// 'SELECT price, tokenSymbol FROM Trades GROUP BY tokenSymbol ORDER BY timestamp_ DESC',
		'SELECT MAX(timestamp_), price, tokenSymbol FROM Trades GROUP BY tokenSymbol',
		function(err,data){
			if (err){
				console.error(err);
			}
			// console.log(data);
			var latest = {};
			data.rows.map(function(trade) {
				latest[trade.tokenSymbol] = trade.price;

			});

			pool.query(
				'SELECT MAX(timestamp_), price, tokenSymbol FROM Trades WHERE timestamp_ < (SELECT MAX(timestamp_) FROM Trades GROUP BY tokenSymbol) GROUP BY tokenSymbol',
				function(err,data){
					if (err){
						console.error(err);
					}
					// console.log(data);
					var second_latest = {};
					data.rows.map(function(trade) {
						second_latest[trade.tokenSymbol] = trade.price;

					});

					var percentages = {};
					for (latest_token in latest) {
						percentages[latest_token] = ((latest[latest_token] - second_latest[latest_token]) / second_latest[latest_token]) * 100
					}
					// console.log(percentages)
					res.json(percentages);
				}
			);
		}
	);
}
