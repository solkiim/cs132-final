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


