// var socket = io.connect('http://localhost:8080');

$(document).ready(function() {
	
	var numTokens;
	var tokenSym;
	var buyOrSell;
	var orderType;
	var username;
	var price;

	socket.on('updateTrades', function(tokenSym, buyOrSell, orderType, numTokens, price, username){

		var ul = $('#trades');
		ul.append($('<li></li>').text(tokenSym + ', ' + buyOrSell + ', ' + orderType + ', ' + numTokens + ', ' + price + ', ' + username));

		});

	$('#buyForm').submit(function(event) {

		event.preventDefault();

		numTokens = $('#buyForm input[name=numTokens]').val();
		tokenSym = $('#buyForm input[name=tokenSymbol]').val();
		buyOrSell = $('#buyForm input[name=buyOrSell]').val();
		orderType = $('#buyForm input[name=orderType').val();
		username = $('#buyForm input[name=username]').val();

		console.log(numTokens);

		$.post('/marketsubmit', tokenSym, buyOrSell, orderType, numTokens, username, function(res, error) {
			console.log("enteringgg");
			if (error){
				console.error(err);
			}

		});

	});

	$('limit-buy-form').submit(function(event){

		event.preventDefault();

		numTokens = $('#limit-buy-form input[name=numTokens]').val();
		price = $('#limit-buy-form input[name=price]').val();
		tokenSym = $('#limit-buy-form input[name=tokenSymbol]').val();
		buyOrSell = $('#limit-buy-form input[name=buyOrSell]').val();
		orderType = $('#limit-buy-form input[name=orderType').val();
		username = $('#limit-buy-form input[name=username]').val();

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


