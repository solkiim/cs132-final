var socket = io.connect('http://localhost:8080');
var news_arr = [];
var num_news = 6;
var current_token = "Uber";


$(document).ready(function() {

	var numTokens;
	var tokenSym;
	var buyOrSell;
	var orderType;
	var username;
	var price;

	// each time you click, update the current_token

	// get function for prices SQL

	socket.on('updateOrders', function(time, buyOrSell, price, numTokens){

		var ul = $('#orders');
		ul.append($('<li></li>').text(time + ', ' + buyOrSell + ', ' + price + ', ' + numTokens));

		});

	$('#buyForm').submit(function(event) {

		event.preventDefault();

		numTokens = $('#buyForm input[name=numTokens]').val();
		tokenSym = $('#buyForm input[name=tokenSymbol]').val();
		buyOrSell = $('#buyForm input[name=buyOrSell]').val();
		orderType = $('#buyForm input[name=orderType').val();
		username = $('#buyForm input[name=username]').val();

		console.log(numTokens);

		$.post('/marketsubmit', tokenSym, buyOrSell, orderType, numTokens, username, function(err, res) {
			console.log("enteringgg");
			if (err){
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

		$.post('/limitsubmit', numTokens, price, tokenSym, buyOrSell, orderType, username, function(err, res){

			if(err){
				console.error(err);
			}

		});

	});

	var times = ["Jan 1","Feb 1","March 1","April 1","May 1", "June 1", "July 1", "Aug 1", "Sep 1", "Oct 1", "Nov 1", "Dec 1"];
	var prices = [100,114,106,106,107,111, 129, 97,89, 105, 106, 122];

	new Chart(document.getElementById("stock-graph"), {
	  type: 'line',
	  data: {
	    labels: times,
	    datasets: [{
	        data : prices, //price
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

	function func () {
		var url = 'https://newsapi.org/v2/top-headlines?' +
								// whatever the current stock is should go in place of "korea" below
		          'q=' + current_token + '&' +
		          'apiKey=692f54e4a0c34c678519cc1407b10bf1';
		var Req = new XMLHttpRequest();

		Req.open("GET", url, true);

		Req.addEventListener("load", function(e){
			var content = Req.responseText;
			var objresponse = JSON.parse(content);
			var articles = objresponse.articles;

			for (var i = 0; i < articles.length; i++) {

				//get the whole article data
				var news = articles[i];

				// get the title of article
				var text = news.title;
				text = text.substring(0, 47);
				text = text.fontsize(2);

				// get the day and time of article in standard time
				var time_stamp = news.publishedAt;
				var day = time_stamp.substring(0, 10);
				var time = time_stamp.substring(11, 19);

				// generate the current date
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth()+1; //January is 0!
				var yyyy = today.getFullYear();
				if(dd<10){
	    		dd='0'+dd;
				}
				if(mm<10){
	    		mm='0'+mm;
				}
				var today = yyyy+'-'+mm+'-'+dd;

				// if array is not full, just add the title to array and add to html list
				if (news_arr.length < num_news) {
					news_arr.splice(0, 0, text);
					if(day == today) {

						$('#news').append("<ul> " + time + " " + text + " ...");
					}
					if (day != today) {
						$('#news').append("<ul> " + day + " " + text + " ...");
					}
				}

				// if array is  full, take away last element from array, add title to array,
				// delete last element from html list and add new element to html list
				if (news_arr.length == num_news) {
					news_arr.splice(num_news, 1); // delete last element from array
					news_arr.splice(0, 0, text); // add new element from array
					$('#news ul:last-child').remove(); //remove last element from list
					// if article is from current day, print the time
					if(day == today) {
						$('#news').append("<ul> " + time + " " + text + " ...");
					}
					// if article is not from current day, print the day
					if (day != today) {
						$('#news').append("<ul> " + day + " " + text + " ...");

					}
				}
				// console.log()
			}
		})
		Req.send();
	}

	func();
	setInterval(func, 10000); //every 10 seconds


});
