// ----------------------------------- SETUP -----------------------------------
var http = require('http');
var server = http.createServer(app);

// dependencies
var express = require('express');
var bodyParser = require('body-parser');
var db = require('any-db');
var dbsql = require('any-db-mysql');
var io = require('socket.io').listen(server);
var path = require("path");
var bodyParser = require('body-parser');
var anyDB = require('any-db');
var engines = require('consolidate');

// other files
var account = require('./account.js');

// set up app
var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/templates'));
app.use('/js', express.static('js'));

// set up database connection
var pool = db.createPool('sqlite3://parallel.db', {min: 0, max: 1000});

// other files
var account = require('./account.js');

app.engine('html', engines.hogan);
app.set('view engine', 'html');


// create tables
pool.query(
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



// ------------------------ rhaime


io.sockets.on('connection', function(socket){

// on signupform submit
app.get('/ordersubmit', function(req, res) {
    
    var reqNumTokens = req.body.numTokens;
    var tokenSym = req.body.tokenSym;
    var buyOrSell = req.body.buyOrSell;
    var orderType = req.body.orderType;
    var username = req.body.username;

    if (buyOrSell = buy){

        executeMarketBuy(buyOrSell, tokenSym, orderType, reqNumTokens, username); 

    } else if (buyOrSell = sell) {

        // execute market sell

    }

    
});

function executeMarketBuy(buyOrSell, tokenSym, orderType, reqNumTokens, username){

    // don't run this function if no rows in Sell
    pool.query('IF EXISTS (SELECT * FROM Sell)', function(err, data) {
        
        if (err) {
            console.log("no sell orders; cannot execute market buy");
        }

        var originalReqNumTokens = reqNumTokens;
        var reqTokens = reqNumTokens;
        var orderReqPrice = reqPrice;

        // clear arrays each time you escape while loop
        var clearedPrices = [];
        var clearedNumTokens = [];

        // for market orders gotta keep going until you execute all trades
        // and sell table is not empty!
        while (reqTokens != 0){
            
            // check last entry in sell (cheapest)
            var row = pool.query('SELECT LIMIT 1 * FROM Sell ORDER BY orderID DESC', function(err,data){
                
                if (err){
                    console.error(err);
                }

                // get that bottom row's numtokens and posted price
                var sellOrderID = data.rows[0].orderID;
                var rowTokens = data.rows[0].numTokens;
                var rowSellPrice = data.rows[0].price;

            });
  
            // meaning you'll need to keep climbing up
            if (rowTokens < reqTokens){
                // update however many tokens you still gotta clear
                reqTokens = reqTokens - rowTokens;
                
                clearedPrices.push(rowSellPrice);
                clearedNumTokens.push(rowTokens);
                
                // delete, since all tokens for that order have been cleared
                pool.query('DELETE from Sell by orderID DESC LIMIT 1', function(err,data){
                    if(err){
                        console.error(err);
                    }
                });


            }

            // if more tokens than you want
            else if (rowTokens >= reqTokens){

                // you're finished
                rowTokens = rowTokens - reqTokens;
                clearedPrices.push(rowSellPrice);
                clearedNumTokens.push(rowNumTokens);

                // exposed to sql injection attacks
                // Update Sell bottom row SET numTokens = rowNumTokens;
                pool.query("UPDATE Sell SET numTokens = '" + rowTokens, function(error,data){
                    if(error){
                        console.error(err);
                    }
                });


                // actual price is the actually transacted price; the price can slip in a market order since it just depends on what orders are on the book
                var price = weightedPrice(clearedPrices, clearedNumTokens);

                // insert into trades history table
                pool.query('INSERT INTO Trades (tokenSym, buyOrSell, orderType, reqNumTokens, price, username) VALUES($1, $2, $3, $4, $5)', [tokenSym, buyOrSell, orderType, originalReqNumTokens, price, username], function(error, data) {

                    if (error){
                      console.log("FAILED to add to database");
                      res.sendStatus(500);
                    } 
                    
                    // trigger function updatingOrders
                    io.sockets.emit('updateTrades', tokenSym, buyOrSell, orderType, originalReqNumTokens, price, username);

                    // done; no more looping
                    reqNumTokens = 0;  

                });
               
            }
                
        }

    });

    // if Sell table is empty, post the market order as 
    

 } 

 function weightedPrice(clearedPrices, clearedNumTokens){

    if (clearedPrices.length != clearedNumTokens.length){
        console.log("error; price & token lengths different");
    
    }

    var length = clearedPrices.length;
    var finalPrice = 0;
    var totalClearedNumTokens = 0;
    var ratio = 0;

    // get total cleared tokens
    for (i=0; i< length-1 ; i++){
        totalClearedNumTokens += clearedNumTokens[i];
    }

    // get total weighted final price 
    for (j=0; j < length-1; j++){
        ratio = clearedNumTokens[j] / totalClearedNumTokens;
        finalPrice += clearedPrices[j]*ratio;
    }

    return finalPrice;

 }


 });


// // RKIM TO DO

// requestMarketSell(){

//     // check first entry in buy

//     // SELECT TOP 1 * FROM Buy
    
//     // make sure 

//  }   


// getMarkets () {

// }

// calcFee () {

// }

// getBalance () {

// }

// getOrderBook () {

// }

// getTicker (symbol) {

// }

// getBidAsks (symbols) {

// }

// getTrades (symbol) {

// }

// getOrders (symbol) {

// }

// getOrder (id, symbol) {

// }

// createOrder () {

// }

// cancelOrder(id, symbol){

// }


// // later

// getMyTrades (symbol, since, limit) {

// }

// getDepositAddress () {

// }

// getWithdrawalFees () {

// }

// withdraw () {

// }




