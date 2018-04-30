// var socket = io.connect();

// const io = require('socket.io-client');
// const socket = io.connect('http://localhost:8080');

$(document).ready(function() {
	
	var numTokens;
	var tokenSym;
	var buyOrSell;
	var orderType;
	var username;
	var price;

	$('#buyForm').submit(function(event) {

		event.preventDefault();

		numTokens = $('#orderForm input[name=numTokens]').val();
		tokenSym = $('#orderForm input[name=tokenSymbol]').val();
		buyOrSell = $('#orderForm input[name=buyOrSell]').val();
		orderType = $('#orderForm input[name=orderType').val();
		username = $('#orderForm input[name=username]').val();

		$.post('/marketsubmit', tokenSym, buyOrSell, orderType, numTokens, username, function(res, error) {

			if (error){
				console.error(err);
			}

		});

	socket.on('updateTrades', function(tokenSym, buyOrSell, orderType, numTokens, price, username){

			var ul = $('#trades');
    		ul.append($('<li></li>').text(tokenSym + ', ' + buyOrSell + ', ' + orderType + ', ' + numTokens + ', ' + price + ', ' + username));

		});

	});

	$('limit-buy-form').submit(function(event){

		event.preventDefault();

		numTokens = $('#orderForm input[name=numTokens]').val();
		price = $('#orderForm input[name=price]').val();
		tokenSym = $('#orderForm input[name=tokenSymbol]').val();
		buyOrSell = $('#orderForm input[name=buyOrSell]').val();
		orderType = $('#orderForm input[name=orderType').val();
		username = $('#orderForm input[name=username]').val();

		$.post('/limitsubmit', numTokens, price, tokenSym, buyOrSell, orderType, username, function(res, error){

			if(error){
				console.error(err);
			}
			
		});

	});

	new Chart(document.getElementById("stock-graph"), {
	  type: 'line',
	  data: {
	    labels: ["Jan 1","Feb 1","March 1","April 1","May 1", "June 1", "July 1", "Aug 1", "Sep 1", "Oct 1", "Nov 1", "Dec 1"],
	    datasets: [{
	        data: [100,114,106,106,107,111, 129, 97,89, 105, 106, 122], //price
	        backgroundColor: '#ffe4b3', //orange
	        borderColor: '#ffc966',
	        fill: true,
	        label: "Uber",
	      }
	    ],
	  },
	  options: {
	responsive: false,
	    title: {
	      display: true,
	      text: 'Uber', //tokenSymbol
	    }
	  }
	});



});


