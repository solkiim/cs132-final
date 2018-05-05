var socket = io.connect('http://localhost:8080');

// global
var default_token = "Uber";
var current_token = "Uber";
var username = sessionStorage.getItem('username');

// news
var news_refresh;
var news_arr = [];
var num_news = 9;

// graph
var graph_times = [];
var graph_prices = [];

$(document).ready(function() {

	token_dashboard(default_token);

	// update dashboard on new token click
	$('.listing').click(function(event) {
		var token_symbol = this.id;
		current_token = token_symbol;
		token_dashboard(token_symbol);
	})

	// get function for prices SQL

	socket.on('newTradeGraphPoint', function(tokenSym, currenttime, price){
		if (tokenSym = current_token) {
			graph_times.shift();
			graph_times.push(currenttime);
			graph_prices.shift();
			graph_prices.push(price);
			graph_update(current_token);
		}
	});

	socket.on('updateOrders', function(tokenSym, time, buyOrSell, price, numTokens){
		if (tokenSym = current_token){

			var ul;

			if (buyOrSell == "sell"){
				ul = $('#sell-list');
				ul.append($('<li></li>').html('<div class="sell-time">' + time + '</div><div class="sell-buyorsell">' + buyOrSell + '</div><div class="sell-price">' + price + '</div><div class="sell-numTokens">' + numTokens + '</div>'));

			} else if (buyOrSell == "buy"){
				ul = $('#buy-list');
				ul.append($('<li></li>').html('<div class="buy-time">' + time + '</div><div class="buy-buyorsell">' + buyOrSell + '</div><div class="buy-price">' + price + '</div><div class="buy-numTokens">' + numTokens + '</div>'));

			}
		}

	});

	$('#buyForm').submit(function(event) {
		event.preventDefault();

		$.post('/marketsubmit', $('#buyForm').serialize() + '&tokenSym=' + current_token + '&username=' + username, function(err, res) {
			if (err){
				alert(err);
			} else {
				$('#buyForm')[0].reset();
				console.log(res);
				if(res == "Error: not enough tokens on orderbook"){
					alert('Error: not enough tokens on orderbook');
				}
			}
		});
	});

	$('#sellForm').submit(function(event) {
		event.preventDefault();

		$.post('/marketsubmit', $('#sellForm').serialize() + '&tokenSym=' + current_token + '&username=' + username, function(err, res) {
			if (err){
				alert(err);
			} else {
				$('#sellForm')[0].reset();
				if(res == "Error: not enough tokens on orderbook"){
					alert('Error: not enough tokens on orderbook');
				}
			}
		});
	});

	$('#limit-buy-form').submit(function(event){
		event.preventDefault();

		$.post('/limitsubmit', $('#limit-buy-form').serialize() + '&tokenSym=' + current_token + '&username=' + username, function(err, res){
			if(err){
				console.log(err);
			} else {
				$('#limit-buy-form')[0].reset();
			}
		});
	});

	$('#limit-sell-form').submit(function(event){
		event.preventDefault();

		$.post('/limitsubmit', $('#limit-sell-form').serialize() + '&tokenSym=' + current_token + '&username=' + username, function(err, res){
			if(err){
				console.log(err);
			} else {
				$('#limit-sell-form')[0].reset();
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

	$.post('/price-graph', 'current_token=' + token_symbol, function(data, status){
		graph_times = data.times;
		graph_prices = data.prices;
		graph_update(token_symbol);
	});
}

function graph_update(token_symbol) {

	// convert from milliseconds to day (mm dd)
	for (var i = 0; i < graph_times.length ; i++) {
		mili = graph_times[i];
		mili = new Date(mili);
		mili = mili.toString();
		mili = mili.substring(4, 10);
		graph_times[i] = mili;
	}

	// make graph
	new Chart(document.getElementById("stock-graph"), {
		type: 'line',
		data: {
			labels: graph_times,
			datasets: [{
				data : graph_prices,
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
			var text = news.description;
			text = text.substring(0, 43);
			text = text.fontsize(2);

			// get the date of article in standard time
			var time_stamp = news.publishedAt;
			var date = time_stamp.substring(0, 10);
			// console.log(day);
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
					$('#articles').append("<li> " + time + " : " + text + " ...</li>");
				}
				if (date != today) {
					date = month+'-'+day+'-'+year;
					$('#articles').append("<li> " + date + " : " + text + " ...</li>");
				}
			}
		});
	})
	Req.send();
}
