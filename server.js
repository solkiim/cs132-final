// ----------------------------------- SETUP -----------------------------------

// dependencies
var express = require('express');
var bodyParser = require('body-parser');
var db = require('any-db');
var dbsql = require('any-db-mysql');

// other files
var account = require('./account.js');

// set up app
var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/templates'));

// set up database connection
var pool = db.createPool('sqlite3://parallel.db', {min: 0, max: 1000});

// create tables
pool.query(
	'CREATE TABLE IF NOT EXISTS account ('+
	'	username TEXT PRIMARY KEY,'+
	'	password TEXT NOT NULL,'+
	'	email TEXT NOT NULL,'+
	'	login_tier INTEGER,'+
	'	firstname TEXT,'+
	'	lastname TEXT,'+
	'	address TEXT,'+
	'	address2 TEXT,'+
	'	city TEXT,'+
	'	zipcode TEXT,'+
	'	telephone INTEGER,'+
	'	acctCreationDateTime INTEGER'+
	')',
	function(err, data) {
		if (err) {
			console.error(err);
		}
	}
);

pool.query(
	'CREATE TABLE IF NOT EXISTS favorite_stock (' +
		'username TEXT, ' +
		'stock_code TEXT, ' +
		'PRIMARY KEY (username, stock_code))',
	function(err, data) {
		if (err) {
			console.error(err);
		}
	}
);

// ------------------------------- ROUTES: PAGES -------------------------------

// home page
app.get('/', function(req, res) {
	res.sendFile('index.html', {root : __dirname + '/templates'});
});

// signup page
app.get('/signup', function(req, res) {
	res.sendFile('signup.html', {root : __dirname + '/templates'});
});

// account page
app.get('/account', function(req, res) {
	res.sendFile('account.html', {root : __dirname + '/templates'});
});

// ----------------------------- ROUTES: ACCOUNTS ------------------------------

app.post('/signupsubmit', function(req, res) {
	account.signupsubmit(pool, req, res);
});
app.post('/verifypassword', function(req, res) {
	account.verifypassword(pool, req, res);
});

// get functions
app.post('/getemail', function(req, res) {
	account.getemail(pool, req, res);
});
app.post('/getfirstname', function(req, res) {
	account.getfirstname(pool, req, res);
});
app.post('/getlastname', function(req, res) {
	account.getlastname(pool, req, res);
});
app.post('/getaddress', function(req, res) {
	account.getaddress(pool, req, res);
});
app.post('/getaddress2', function(req, res) {
	account.getaddress2(pool, req, res);
});
app.post('/getcity', function(req, res) {
	account.getcity(pool, req, res);
});
app.post('/getzipcode', function(req, res) {
	account.getzipcode(pool, req, res);
});
app.post('/gettelephone', function(req, res) {
	account.gettelephone(pool, req, res);
});

// set functions
app.post('/setusername', function(req, res) {
	account.setusername(pool, req, res);
});
app.post('/setpassword', function(req, res) {
	account.setpassword(pool, req, res);
});
app.post('/setemail', function(req, res) {
	account.setemail(pool, req, res);
});
app.post('/setfirstname', function(req, res) {
	account.setfirstname(pool, req, res);
});
app.post('/setlastname', function(req, res) {
	account.setlastname(pool, req, res);
});
app.post('/setaddress', function(req, res) {
	account.setaddress(pool, req, res);
});
app.post('/setaddress2', function(req, res) {
	account.setaddress2(pool, req, res);
});
app.post('/setcity', function(req, res) {
	account.setcity(pool, req, res);
});
app.post('/setzipcode', function(req, res) {
	account.setzipcode(pool, req, res);
});
app.post('/settelephone', function(req, res) {
	account.settelephone(pool, req, res);
});

// duplicate check functions
app.post('/duplicateusername', function(req, res) {
	account.duplicateusername(pool, req, res);
});
app.post('/duplicateemail', function(req, res) {
	account.duplicateemail(pool, req, res);
});

// favorite stocks
app.post('/getfavoritestocks', function(req, res) {
	account.getfavoritestocks(pool, req, res);
});
app.post('/addfavoritestock', function(req, res) {
	account.addfavoritestock(pool, req, res);
});
app.post('/removefavoritestock', function(req, res) {
	account.removefavoritestock(pool, req, res);
});

// portfolio
app.post('/getportfolio', function(req, res) {
	account.getportfolio(pool, req, res);
});
app.post('/addtoportfolio', function(req, res) {
	account.addtoportfolio(pool, req, res);
});
app.post('/removefromportfolio', function(req, res) {
	account.removefromportfolio(pool, req, res);
});

// -------------------------------- APP: OTHER ---------------------------------

app.get('*', function(req, res) {
	res.sendFile('404.html', {root : __dirname + '/templates'});
});

var server = app.listen(8080);

// app exit
process.on('SIGINT', function() {
	pool.close();
	server.close();
	process.exit();
});
