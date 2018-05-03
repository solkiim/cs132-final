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

		var ul = $('#order-list');
		ul.append($('<li></li>').text(time + ', ' + buyOrSell + ', ' + price + ', ' + numTokens));

		});

	$('#buyForm').submit(function(event) {

		event.preventDefault();

		$.post('/marketsubmit', $('#buyForm').serialize(), function(err, res) {
			if (err){
				console.error(err);
			}

			console.log(buyOrSell);

		});

	});

	$('#limit-buy-form').submit(function(event){

		event.preventDefault();

		$.post('/limitsubmit', $('#limit-buy-form').serialize(), function(err, res){

			if(err){
				console.error(err);
			}

		});

	});

	// get stock graph
	stock_graph(current_token);
	
	// get news
	refresh_news(current_token);
	setInterval(function() { refresh_news(current_token); }, 10000); //every 10 seconds
});

// populate stock graph
function stock_graph (token_symbol) {
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
	        label: token_symbol,
	      }
	    ],
	  },
	  options: {
	responsive: false,
	    title: {
	      display: true,
	      text: token_symbol,
	    }
	  }
	});
}

// refresh news
function refresh_news (token_symbol) {
	var url = 'https://newsapi.org/v2/top-headlines?' +
		// whatever the current stock is should go in place of "korea" below
		'q=' + token_symbol + '&' +
		'apiKey=692f54e4a0c34c678519cc1407b10bf1';
	var Req = new XMLHttpRequest();

	Req.open("GET", url, true);

	Req.addEventListener("load", function(e){
		var content = Req.responseText;
		var objresponse = JSON.parse(content);
		var articles = objresponse.articles;
		
		articles.map(function(news) {
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
			
			// prevent repeats
			if (!news_arr.includes(text)) {
				// if array is  full, take away last element from array, add title to array,
				// delete last element from html list and add new element to html list
				if (news_arr.length >= num_news) {
					news_arr.pop(); // delete last element from array
					$('#articles li:last-child').remove(); //remove last element from list
				}
				
				// add title to beginning of array
				news_arr.unshift(text);
				
				// add to html list
				if(day == today) {
					$('#articles').append("<li> " + time + " : " + text + " ...");
				}
				if (day != today) {
					$('#articles').append("<li> " + day + " : " + text + " ...");
				}
			}
		});
	})
	Req.send();
}
