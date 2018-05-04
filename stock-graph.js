exports.getPrices = function(pool, req, res) {
	pool.query('SELECT price, timestamp_ FROM Trades ORDER BY timestamp_ DESC LIMIT 25', function(err,data){
		if (err){
			console.error(err);
		}
		// flip for ascending time
		data.rows = data.rows.reverse();
		
		res.json({prices: data.rows.map(trade => trade.price), times: data.rows.map(trade => trade.timestamp_)});
	});
}
