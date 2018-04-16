var express = require('express');
var bodyParser = require('body-parser');
var db = require('any-db');
var dbsql = require('any-db-mysql');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// on signupform submit

if (buyOrSell = buy){
	
	// insert into buy table

	conn.query('INSERT INTO Buy (room, nickname, body, time) VALUES($1, $2, $3, $4)', [roomNamee, nicknamee, message, timee], function(error, data) {
        if (error){
          console.log("FAILED to add to database")
          res.sendStatus(500);
        } else {
          messages = data.rows;
        }
      });

} else if (buyOrSell = sell){

	// insert into sell table

	conn.query('INSERT INTO Sell (room, nickname, body, time) VALUES($1, $2, $3, $4)', [roomNamee, nicknamee, message, timee], function(error, data) {
        if (error){
          console.log("FAILED to add to database")
          res.sendStatus(500);
        } else {
          messages = data.rows;
        }
      });

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














