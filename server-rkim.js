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

// RKIM

app.get('/account', function(req, res) {
    res.sendFile('trading-platform.html', {root : __dirname + '/templates'});
});

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

    }


    else if (buyOrSell = sell) {

        // insert into sell table
        pool.query('INSERT INTO Sell (tokenSymbol, buyOrSell, orderType, numTokens, price, username) VALUES($1, $2, $3, $4)', [tokenSym, buyOrSell, orderType, numTokens, price, username], function(error, data) {

            if (error){

              console.log("FAILED to add to database");
              res.sendStatus(500);

            } else {

            	executeMarketSell();
              
            }


          });

    }

    
});

executeMarketBuy(buyOrSell, tokenSym, orderType, reqNumTokens, reqPrice, username){

    var reqNumTokens = reqNumTokens;
    var orderReqPrice = reqPrice;

    // don't run this functino if no rows in Sell
    pool.query('IF EXISTS (SELECT * FROM Sell),' function(err, data) {
        if (err) {
            console.error(err);
        }
    });

        // initialize first inquiry
        var row = SELECT BOTTOM 1 * FROM Sell;
        var rowNumTokens = 0;
        var rowSellPrice = 0;
        var newPrice = 0;
        var clearedPrices = [];
        var clearedNumTokens = [];

        // for market orders gotta keep going until you execute all trades
        while (reqNumTokens != 0 && Sell table is not empty){
            
            // check last entry in sell
            row = SELECT TOP 1 * FROM Sell ORDER BY orderID DESC;
            rowNumTokens = rows tokens;
            rowNumTokens = rows numTokens;
            rowSellPrice = rows price;
                 
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
                pool.query('INSERT INTO Buy (tokenSym, buyOrSell, orderType, reqNumTokens, newPrice, username) VALUES($1, $2, $3, $4)', [tokenSym, buyOrSell, orderType, numTokens, price, username], function(error, data) {

                    if (error){
                      console.log("FAILED to add to database");
                      res.sendStatus(500);

                    } 
                    
                    // done; no more looping
                    reqNumTokens = 0;  

                });
               
            }
                
        }
    

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














