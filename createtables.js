// ----------------------------------- SETUP -----------------------------------

var async = require('async');

// ------------------------------- SQL COMMANDS --------------------------------

exports.createsqltables = function(pool) {
	var sqlqueries = [
		'CREATE TABLE IF NOT EXISTS account ('+
		'   username TEXT PRIMARY KEY,'+
		'   password TEXT NOT NULL,'+
		'   email TEXT NOT NULL,'+
		'   login_tier INTEGER,'+
		'   firstname TEXT,'+
		'   lastname TEXT,'+
		'   address TEXT,'+
		'   address2 TEXT,'+
		'   city TEXT,'+
		'   zipcode TEXT,'+
		'   telephone INTEGER,'+
		'   acctCreationDateTime INTEGER'+
		')',
		
		'CREATE TABLE IF NOT EXISTS Sell ('+
		'   orderID INTEGER PRIMARY KEY AUTOINCREMENT,'+
		'   tokenSymbol TEXT,'+
		'   orderType TEXT,'+
		'   numTokens INTEGER,'+
		'   price INTEGER,'+
		'   username TEXT,'+
		'   timestamp_ INTEGER' +
		')',
		
		'CREATE TABLE IF NOT EXISTS Buy ('+
		'   orderID INTEGER PRIMARY KEY AUTOINCREMENT,'+
		'   tokenSymbol TEXT,'+
		'   orderType TEXT,'+
		'   numTokens INTEGER,'+
		'   price INTEGER,'+
		'   username TEXT,'+
		'   timestamp_ INTEGER' +
		')',
		
		'CREATE TABLE IF NOT EXISTS Trades ('+
		'   orderID INTEGER PRIMARY KEY AUTOINCREMENT,'+
		'   tokenSymbol TEXT,'+
		'   orderType TEXT,'+
		'   numTokens INTEGER,'+
		'   price INTEGER,'+
		'   username TEXT,'+
		'   timestamp_ INTEGER' +
		')',
	];

	async.map(sqlqueries, function(sqlquery, callback) {
		pool.query(sqlquery, function(err, data) {
			if (err) {
				console.error(err);
			}
		});
	});
}
