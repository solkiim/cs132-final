
app.get('/account', function(req, res) {
    res.sendFile('trade.html', {root : __dirname + '/templates'});
});

// on signupform submit
app.post('/ordersubmit', function(req,res) {
    
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
                  messages = data.rows;
                }
              });

        } else if (buyOrSell = sell){

            // insert into sell table
            pool.query('INSERT INTO Sell (tokenSymbol, buyOrSell, orderType, numTokens, price, username) VALUES($1, $2, $3, $4)', [tokenSym, buyOrSell, orderType, numTokens, price, username], function(error, data) {
                if (error){
                  console.log("FAILED to add to database");
                  res.sendStatus(500);
                } else {
                  messages = data.rows;
                }
              });

        }

        // and then trigger function to update orders

    }
});


 marketOrder(buyOrSell, price){

    if (buyOrSell = Buy) {

        // see what column 0 is on the buy table
        // executed price now = col 0 price

        // call executeOrder to insert into order table

    }

 } 

 executeOrder(){

    // insert into order table all the variables passed in

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














