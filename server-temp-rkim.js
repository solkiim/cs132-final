app.get('/account', function(req, res) {
    res.sendFile('trade.html', {root : __dirname + '/templates'});
});

// on signupform submit
app.post('/ordersubmit', function(req,res) {
    
    var buyOrSell = req.body.buyOrSell;
    var tokenSym = req.body.tokenSym;
    var orderType = req.body.orderType;
    var numTokens = req.body.numTokens;
    var price = req.body.price;
    var username = req.body.username;

    function(err, data) {

        if (err) {
            console.error(err);
            return res.status(500).send('error inserting order');
        }

        if (buyOrSell = buy){
    
            // insert into buy table
            pool.query('INSERT INTO Buy (tokenSymbol, buyOrSell, orderType, numTokens, price, username) VALUES($1, $2, $3, $4)', [tokenSym, buyOrSell, orderType, numTokens, price, username], function(error, data) {

                if (error){

                  console.log("FAILED to add to database");
                  res.sendStatus(500);

                } else {
                  
                  // trigger executeMarketBuy

                }

              });

        } else if (buyOrSell = sell){

            // insert into sell table
            pool.query('INSERT INTO Sell (tokenSymbol, buyOrSell, orderType, numTokens, price, username) VALUES($1, $2, $3, $4)', [tokenSym, buyOrSell, orderType, numTokens, price, username], function(error, data) {

                if (error){

                  console.log("FAILED to add to database");
                  res.sendStatus(500);

                } else {

                	// trigger executeMarketSell
                  
                }

              });

        }

        // and then trigger function to update orders

    }
});

 executeMarketBuy(){

    // check last entry in sell
    // dont know how

    SELECT TOP 1 * FROM Sell

    // send back to display



 } 

 executeMarketSell(){

    // check first entry in buy

    SELECT TOP 1 * FROM Buy
    




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














