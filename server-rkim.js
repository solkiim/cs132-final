// other files
var account = require('./index.js');

var http = require('http'); // this is new
var express = require('express');
var app = express();
var server = http.createServer(app); // this is new
// add socket.io
var io = require('socket.io').listen(server);
// send to one user

var path = require("path");
var bodyParser = require('body-parser');
var anyDB = require('any-db');

var engines = require('consolidate');
app.use('/js', express.static('js'));
app.engine('html', engines.hogan);
app.set('views', __dirname + '/templates');
app.set('view engine', 'html');


app.get('/account', function(req, res) {
    res.sendFile('trading-platform.html', {root : __dirname + '/templates'});
});


io.sockets.on('connection', function(socket){

// on signupform submit
app.post('/ordersubmit', function(req, res) {
    
    var buyOrSell = req.body.buyOrSell;
    var tokenSym = req.body.tokenSym;
    var orderType = req.body.orderType;
    var reqNumTokens = req.body.numTokens;
    var reqPrice = req.body.price;
    var username = req.body.username;

    if (buyOrSell = buy){

        executeMarketBuy(buyOrSell, tokenSym, orderType, reqNumTokens, reqPrice, username); 

    } else if (buyOrSell = sell) {

        // execute market sell

    }

    
});

executeMarketBuy(buyOrSell, tokenSym, orderType, reqNumTokens, reqPrice, username){

    var reqNumTokens = reqNumTokens;
    var orderReqPrice = reqPrice;

    // don't run this function if no rows in Sell
    pool.query('IF EXISTS (SELECT * FROM Sell),' function(err, data) {
        
        if (err) {
            console.log("no sell orders; cannot execute market buy");
        }

        var reqNumTokens = reqNumTokens;
        var newPrice = 0;
        var clearedPrices = [];
        var clearedNumTokens = [];

        // for market orders gotta keep going until you execute all trades
        // and sell table is not empty!
        while (reqNumTokens != 0){
            
            // check last entry in sell
            var row = pool.query('SELECT TOP 1 * FROM Sell ORDER BY orderID DESC,' function(err,data){
                if (err){
                    console.error(err);
                }
            });

            var rowNumTokens = rows numTokens;



            var rowSellPrice = rows price; 

            
                 
            // meaning you'll need to keep climbing up
            if (rowNumTokens < reqNumTokens){
                // update however many tokens you still gotta clear
                reqNumTokens = reqNumTokens - rowNumTokens;
                
                clearedPrices.push(rowSellPrice);
                clearedNumTokens.push(rowNumTokens);
                // since all the tokens on the order book are finished
                DELETE row;
            }

            // if more tokens than you want
            if (rowNumTokens >= reqNumTokens){

                // you're finished
                rowNumTokens = rowNumTokens - reqNumTokens;
                clearedPrices.push(rowSellPrice);
                clearedNumTokens.push(rowNumTokens);
                
                UPDATE INSERT INTO row rowNumTokens w updated value;

                newPrice = weightedPrice(clearedPrices, clearedNumTokens);

                // insert into buy table
                pool.query('INSERT INTO Trades (tokenSym, buyOrSell, orderType, reqNumTokens, newPrice, username) VALUES($1, $2, $3, $4)', [tokenSym, buyOrSell, orderType, numTokens, price, username], function(error, data) {

                    if (error){
                      console.log("FAILED to add to database");
                      res.sendStatus(500);
                    } 
                    
                    // trigger function updatingOrders
                    io.sockets.emit('updateTrades', tokenSym, buyOrSell, orderType, numTokens, newPrice, username);

                    // done; no more looping
                    reqNumTokens = 0;  

                });
               
            }
                
        }

    });
    

 } 

 weightedPrice(clearedPrices, clearedNumTokens){

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
    for (j=0; j < length-1, j++){
        ratio = clearedNumTokens[j] / totalClearedNumTokens;
        finalPrice += clearedPrices[j]*ratio;
    }

    return finalPrice;

 }


 });


// RKIM TO DO

 requestMarketSell(){

    // check first entry in buy

    // SELECT TOP 1 * FROM Buy
    
    // make sure 

 }   


getMarkets () {

}

calcFee () {

}

getBalance () {

}

getOrderBook () {

}

getTicker (symbol) {

}

getBidAsks (symbols) {

}

getTrades (symbol) {

}

getOrders (symbol) {

}

getOrder (id, symbol) {

}

createOrder () {

}

cancelOrder(id, symbol){

}


// later

getMyTrades (symbol, since, limit) {

}

getDepositAddress () {

}

getWithdrawalFees () {

}

withdraw () {

}














