// dependencies
var express = require('express');
var bodyParser = require('body-parser');
var db = require('any-db');
var dbsql = require('any-db-mysql');

// set up app
var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/templates'));

// set up database connection
var pool = db.createPool('sqlite3://chatroom.db', {min: 0, max: 1000});

// create tables
pool.query(
	'CREATE TABLE IF NOT EXISTS account (' +
		'username TEXT PRIMARY KEY, ' +
		'password TEXT NOT NULL UNIQUE, ' +	// TODO: secure password
		'email TEXT NOT NULL UNIQUE, ' +
		'login_tier INTEGER)',	// 0:email not verified, 1:email verified, 2:accredited
	function(err, data) {
		if (err) {
			console.error(err);
		}
	}
);

pool.query(
	'CREATE TABLE IF NOT EXISTS favorite_stock (' +
		'username TEXT, ' +
		'stock_code TEXT)',	// 0:email not verified, 1:email verified, 2:accredited
	function(err, data) {
		if (err) {
			console.error(err);
		}
	}
);

// routes
app.get('/', function(req, res) {
	res.sendFile('index.html', {root : __dirname + '/templates'});
});

app.post('/loginsubmit', function(req, res) {
	// TODO: secure password
	var username = req.body.username;
	res.redirect('/account');
});

app.get('/signup', function(req, res) {
	res.sendFile('signup.html', {root : __dirname + '/templates'});
});

app.post('/duplicateusername', function(req, res) {
	pool.query('SELECT * FROM account WHERE username=$1',
		[req.body.username],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error checking duplicate username');
			}
			
			// return true if duplicate, false otherwise
			return res.json(data.rows.length > 0);
		}
	);
});

app.post('/duplicateemail', function(req, res) {
	pool.query('SELECT * FROM account WHERE email=$1',
		[req.body.email],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error checking duplicate email');
			}
			
			// return true if duplicate, false otherwise
			return res.json(data.rows.length > 0);
		}
	);
});

app.post('/signupsubmit', function(req, res) {
	// TODO: secure password
	
	pool.query('INSERT INTO account VALUES ($1, $2, $3, 0)',
		[req.body.username, req.body.password, req.body.email],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error signing up');
			}
		}
	);
});

app.get('/account', function(req, res) {
	res.sendFile('account.html', {root : __dirname + '/templates'});
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
