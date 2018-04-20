$(document).ready(function() {
	// signup form submitted

	// send all the data over
	$('#orderForm').submit(function(event) {

		event.preventDefault();

		var tokenSym = $('#orderForm input[name=tokenSymbol]').val();
		var buyOrSell = $('#orderForm input[name=buyOrSell]').val();
		var orderType = $('#orderForm input[name=orderType').val();
		var numTokens = $('#orderForm input[name=numTokens]').val();
		// var price = $('#orderForm input[name=orderType]').val();
		var username = $('#orderForm input[name=username]').val();


		$.post('/ordersubmit', tokenSym, buyOrSell, orderType, numTokens, username, function(res, error) {

			if (error){
				console.error(err);
			}

		});

	socket.on('updateTrades', function(tokenSym, buyOrSell, orderType, numTokens, price, username){

			var ul = $('#trades');
    		ul.append($('<li></li>').text(tokenSym + ', ' + buyOrSell + ', ' + orderType + ', ' + numTokens + ', ' + price + ', ' + username));

		});



});
