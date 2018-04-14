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
		'password TEXT, ' +
		'email TEXT, ' +
		'login_tier INTEGER)',	// 0:email not verified, 1:email verified, 2:accredited
	function(err, data) {
		if (err) {
			console.error(err);
		}
	}
);

// routes
app.get('/', function(req, res) {
	res.render('index.html');
});

app.post('/loginsubmit', function(req, res) {
	var username = req.body.username;
	response.redirect('/account');
});

app.get('/signup', function(req, res) {
	res.render('signup.html');
});

app.post('/signupsubmit', function(req, res) {
	var username = req.body.username;
	response.redirect('/account');
});

app.get('/account', function(req, res) {
	res.render('account.html');
});

app.get('*', function(req, res) {
	res.render('404.html');
});

var server = app.listen(8080);

// app exit
process.on('SIGINT', function() {
	pool.close();
	server.close();
	process.exit();
});
