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
	'CREATE TABLE IF NOT EXISTS account (' +
		'username TEXT PRIMARY KEY, ' +
		'password TEXT NOT NULL, ' +
		'email TEXT NOT NULL UNIQUE, ' +
		'login_tier INTEGER)',	// 0:email not verified, 1:email verified, 2:accredited, 99:admin
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

// check if username already exists
app.post('/duplicateusername', function(req, res) {
	account.duplicateusername(pool, req, res);
});

// check if email already exists
app.post('/duplicateemail', function(req, res) {
	account.duplicateemail(pool, req, res);
});

// signup form submit
app.post('/signupsubmit', function(req, res) {
	account.signupsubmit(pool, req, res);
});

// get email for given username
app.post('/getemail', function(req, res) {
	account.getemail(pool, req, res);
});

// update account's username
app.post('/updateusername', function(req, res) {
	account.updateusername(pool, req, res);
});

// update account's email
app.post('/updateemail', function(req, res) {
	account.updateemail(pool, req, res);
});

// update account's password
app.post('/updatepassword', function(req, res) {
	account.updatepassword(pool, req, res);
});

// verify password for username
app.post('/verifypassword', function(req, res) {
	account.verifypassword(pool, req, res);
});

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
