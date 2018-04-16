var express = require('express');
var bodyParser = require('body-parser');
var db = require('any-db');
var dbsql = require('any-db-mysql');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());




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

getTickers (symbols) {

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


// extras

getMyTrades (symbol, since, limit) {

}

getDepositAddress () {

}

getWithdrawalFees () {

}

withdraw () {

}
















