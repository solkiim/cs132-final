// ----------------------------------- SETUP -----------------------------------

// dependencies
var express = require('express');
var bodyParser = require('body-parser');
var db = require('any-db');
var dbsql = require('any-db-mysql');
const bcrypt = require('bcrypt');

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
		'login_tier INTEGER)',	// 0:email not verified, 1:email verified, 2:accredited, 99: admin
	function(err, data) {
		if (err) {
			console.error(err);
		}
	}
);

// TODO: setup after all stocks are set up @rhaime
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

// check if email already exists
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

// signup form submit
app.post('/signupsubmit', function(req, res) {
	// secure password
	bcrypt.hash(req.body.password, 10, function(err, hash) {
		if (err) {
			console.error(err);
			return res.status(500).send('error updating password');
		}
		
		// make new account
		pool.query('INSERT INTO account VALUES ($1, $2, $3, 0)',
			[req.body.username, hash, req.body.email],
			function(err, data) {
				if (err) {
					console.error(err);
					return res.status(500).send('error signing up');
				}
				res.sendStatus(204);
			}
		);
	});
});

// get email for given username
app.post('/getemail', function(req, res) {
	pool.query('SELECT email FROM account WHERE username=$1',
		[req.body.username],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error getting email');
			}
			res.json(data.rows[0].email);
		}
	);
});

// update account's username
app.post('/updateusername', function(req, res) {
	pool.query('UPDATE account SET username = $1 WHERE username = $2',
		[req.body.newusername, req.body.oldusername],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error updating username');
			}
		}
	);
});

// update account's email
app.post('/updateemail', function(req, res) {
	pool.query('UPDATE account SET email = $1 WHERE username = $2',
		[req.body.email, req.body.username],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error updating email');
			}
		}
	);
});

// update account's password
app.post('/updatepassword', function(req, res) {
	// secure password
	bcrypt.hash(req.body.password, 10, function(err, hash) {
		if (err) {
			console.error(err);
			return res.status(500).send('error updating password');
		}
		
		// update account
		pool.query('UPDATE account SET password = $1 WHERE username = $2',
			[hash, req.body.username],
			function(err, data) {
				if (err) {
					console.error(err);
					return res.status(500).send('error updating password');
				}
			}
		);
	});
});

// verify password for username
app.post('/verifypassword', function(req, res) {
	pool.query('SELECT * FROM account WHERE username=$1',
		[req.body.username],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error checking duplicate email');
			}
			
			if (data.rows.length == 0) {
				console.error(err);
				return res.status(400).send('no such username exists');
			}
			
			bcrypt.compare(req.body.password, data.rows[0].password, function(hasherr, hashres) {
				if (hasherr) {
					console.error(err);
					return res.status(500).send('error checking duplicate email');
				}
				
				// return true if password and username match, false otherwise
				return res.json(hashres);
			});
		}
	);
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
