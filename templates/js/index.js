var socket = io.connect('http://localhost:8080');
var news_arr = [];
var num_news = 10;
var default_token = "Uber";
var current_token = "Uber";
var news_refresh;

$(document).ready(function() {

	token_dashboard(default_token);

	// update dashboard on new token click
	$('.listing').click(function(event) {
		var token_symbol = this.id;
		current_token = token_symbol;
		token_dashboard(token_symbol);
	})

	// get function for prices SQL

	socket.on('updateOrders', function(tokenSym, time, buyOrSell, price, numTokens){

		if (tokenSym = current_token){
			
			var ul;

			if (buyOrSell == "sell"){
				ul = $('#sell-list');
				
			} else if (buyOrSell == "buy"){
				ul = $('#buy-list');
			}

			ul.append($('<li></li>').text(time + ', ' + buyOrSell + ', ' + price + ', ' + numTokens));

			}
		
	});

	$('#buyForm').submit(function(event) {
		event.preventDefault();

		$.post('/marketsubmit', $('#buyForm').serialize() + '&tokenSym=' + current_token, function(err, res) {
			if (err){
				console.error(err);	// dont do this
			}
			console.log(buyOrSell);
		});
	});

	$('#limit-buy-form').submit(function(event){
		event.preventDefault();

		$.post('/limitsubmit', $('#limit-buy-form').serialize() + '&tokenSym=' + current_token, function(err, res){
			if(err){
				console.error(err);	// dont do this
			}
		});
	});
});

function token_dashboard (token_symbol) {
	// get news
	$('#articles').empty();
	news_arr = [];
	refresh_news(token_symbol);
	if (news_refresh) {
		clearInterval(news_refresh);
	}
	news_refresh = setInterval(function() { refresh_news(token_symbol); }, 10000); //every 10 seconds

	// get stock graph
	stock_graph(token_symbol);
}

// populate stock graph
function stock_graph (token_symbol) {
	$('#stock-graphs h3').html(token_symbol);

	var times = [];
	var prices = [];


	$.post('/price-graph', 'current_token=' + token_symbol, function(data, status){
		console.log(data)
		
		prices = data.prices;
		times = data.times;
	});

	times = ["Jan 1","Feb 1","March 1","April 1","May 1", "June 1", "July 1", "Aug 1", "Sep 1", "Oct 1", "Nov 1", "Dec 1"];
	prices = [100,114,106,106,107,111, 129, 97,89, 105, 106, 122];

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
		responsive: true,
		maintainAspectRatio: false,
		legend: {
			display: false
		},
	}
});
}

// refresh news
function refresh_news (token_symbol) {
	var url = 'https://newsapi.org/v2/everything?' + 'q=' + token_symbol +
		'&apiKey=692f54e4a0c34c678519cc1407b10bf1&language=en&sortBy=relevancy';
	var Req = new XMLHttpRequest();

	Req.open("GET", url, true);

	Req.addEventListener("load", function(e){
		var content = Req.responseText;
		var objresponse = JSON.parse(content);
		var articles = objresponse.articles;

		articles.map(function(news) {
			// get the title of article
			var text = news.title;
			text = text.substring(0, 43);
			text = text.fontsize(2);

			// get the date of article in standard time
			var time_stamp = news.publishedAt;
			var date = time_stamp.substring(0, 10);
			var year = date.substring(0, 4);
			var month = date.substring(5, 7);
			var day = date.substring(8, 10);
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
				if(date == today) {
					$('#articles').append("<li> " + time + " : " + text + " ...");
				}
				if (date != today) {
					date = month+'-'+day+'-'+year;
					$('#articles').append("<li> " + date + " : " + text + " ...");
				}
			}
		});
	})
	Req.send();
}
