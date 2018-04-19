app.get('/account', function(req, res) {
    res.sendFile('trade.html', {root : __dirname + '/templates'});
});

// on signupform submit
app.post('/ordersubmit', function(req,res) {
    
    var buyOrSell = req.body.buyOrSell;
    var tokenSym = req.body.tokenSym;
    var orderType = req.body.orderType;
    var reqNumTokens = req.body.numTokens;
    var reqPrice = req.body.price;
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
                  
                  executeMarketBuy

                }

              });

        } else if (buyOrSell = sell){

            // insert into sell table
            pool.query('INSERT INTO Sell (tokenSymbol, buyOrSell, orderType, numTokens, price, username) VALUES($1, $2, $3, $4)', [tokenSym, buyOrSell, orderType, numTokens, price, username], function(error, data) {

                if (error){

                  console.log("FAILED to add to database");
                  res.sendStatus(500);

                } else {

                	executeMarketSell
                  
                }

              });

        }

        // and then trigger function to update orders

    }
});

executeMarketBuy(){

    if (Sell table is empty){
        error;

    } else {

        // initialize first inquiry
        var row = SELECT BOTTOM 1 * FROM Sell;
        var reqNumTokens = rows tokens;
        var numTokens = 0;
        var sellPrice = 0;
        var clearedPrices = [];
        var clearedNumTokens = [];

        // for market orders gotta keep going until you execute all trades
        while (reqNumTokens != 0 && Sell table is not empty){
            
            // check last entry in sell
            row = SELECT BOTTOM 1 * FROM Sell;
            reqNumTokens = rows tokens;
            var numTokens = rows numTokens;
            sellPrice = rows price;
                 
            // meaning you'll need to keep climbing up
            if (numTokens < reqNumTokens){
                // update however many tokens you still gotta clear
                reqNumTokens = reqNumTokens - numTokens;
                
                clearedPrices.push(sellPrice);
                clearNumTokens.push(numTokens);
                // since all the tokens on the order book are finished
                DELETE row;
            }

            // if more tokens than you want
            if (numTokens >= reqNumTokens){

                // you're finished
                numTokens = numTokens - reqNumTokens;
                UPDATE INSERT INTO row numTokens w updated value

                clearedPrices.push(sellPrice);
                clearedNumTokens.push(numTokens);

                // done; no more looping
                reqNumTokens = 0;
               
            }
                

            
            

        }

    }
    

 } 



 requestMarketSell(){

    // check first entry in buy

    SELECT TOP 1 * FROM Buy
    
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














