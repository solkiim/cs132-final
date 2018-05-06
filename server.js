// ----------------------------------- SETUP -----------------------------------

// dependencies
var express = require('express');
var bodyParser = require('body-parser');
var engines = require('consolidate');
var db = require('any-db');
var dbsql = require('any-db-mysql');
const fileUpload = require('express-fileupload');
var http = require('http');

// other files
var account = require('./account.js');
var createtables = require('./createtables.js');
var stockgraph = require('./stock-graph.js');
var trade = require('./trade.js');

// set up app
var app = express();
app.use(fileUpload());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/templates'));
app.use('/js', express.static('js'));

// set up database connection
var pool = db.createPool('sqlite3://parallel.db', {min: 0, max: 1000});

// set up server
var server = http.createServer(app);

// add socket.io
var io = require('socket.io').listen(server);

// create tables
createtables.createsqltables(pool);

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
app.post('/deleteaccount', function(req, res) {
	account.deleteaccount(pool, req, res);
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
app.post('/setname', function(req, res) {
	account.setname(pool, req, res);
});
app.post('/setaddress', function(req, res) {
	account.setaddress(pool, req, res);
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

// login tier
app.post('/getlogintier', function(req, res) {
	account.getlogintier(pool, req, res);
});
app.post('/setlogintier', function(req, res) {
	account.setlogintier(pool, req, res);
});
app.post('/logintierfileupload', function(req, res) {
	account.logintierfileupload(pool, req, res);
});

// portfolio
app.post('/getportfolio', function(req, res) {
	account.getportfolio(pool, req, res);
});

// ------------------------------- ROUTES: TRADE -------------------------------

app.post('/getorders', function(req, res) {
	trade.getorders(io, pool, req, res);
});

// on signupform submit
app.post('/marketsubmit', function(req, res) {
	trade.marketsubmit(io, pool, req, res);
});

// on limit submit
app.post('/limitsubmit', function(req, res){
	trade.limitsubmit(io, pool, req, res);
});

// ---------------------------- ROUTES: PRICE GRAPH ----------------------------

app.post('/price-graph', function(req, res) {
	stockgraph.getPrices(pool, req, res);
});


// -------------------------------- APP: OTHER ---------------------------------

app.get('*', function(req, res) {
	res.sendFile('404.html', {root : __dirname + '/templates'});
});

// start server
var serverlisten = server.listen(8080);

// app exit
process.on('SIGINT', function() {
	// close everything
	pool.close();
	serverlisten.close();
	process.exit();
});

// 404 all other routes
app.get('*', function(req, res) {
	res.sendFile('404.html', {root : __dirname + '/templates'});
});

// start server
var serverlisten = server.listen(8080);

// app exit
process.on('SIGINT', function() {
	// close everything
	pool.close();
	serverlisten.close();
	process.exit();
});

// ------------------------------- SOCKET EVENTS -------------------------------

io.sockets.on('connection',function(socket){
	// put socket events here
});
