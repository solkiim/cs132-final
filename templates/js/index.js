var socket = io.connect('http://localhost:8080');

// global
var default_token = "Uber";
var current_token = "Uber";
var username = sessionStorage.getItem('username');

// news
var news_refresh;
var news_arr = [];
var num_news = 20;

// graph
var graph_times = [];
var graph_prices = [];

$(document).ready(function() {

	$.post('/getorders', function(data, status) {

		data.map(function (order) {

			var id = order.orderID;
			var tokens = order.numTokens;
			var price = order.price;
			var ul;

			var time = order.timestamp_;
			var hours = time.getHours();
			var min = time.getUTCHours();
			var secs = time.getUTCSeconds();
			var hoursMin = hours + ":" + min + ":" + secs;

			if (buyOrSell == "sell"){
				ul = $('#sell-list');
				ul.append($('<li></li>').html('<div id="' + id + '"" class="sell-time">' + hoursMin + '</div><div class="sell-buyorsell">' + buyOrSell + '</div><div class="sell-price">' + price + '</div><div class="sell-numTokens">' + numTokens + '</div>'));

			} else if (buyOrSell == "buy"){
				ul = $('#buy-list');
				ul.append($('<li></li>').html('<div id="' + id + '"" class="buy-time">' + hoursMin + '</div><div class="buy-buyorsell">' + buyOrSell + '</div><div class="buy-price">' + price + '</div><div class="buy-numTokens">' + numTokens + '</div>'));

			}


		});


	});

	token_dashboard(default_token);

	// update dashboard on new token click
	$('.listing').click(function(event) {
		var token_symbol = this.id;
		current_token = token_symbol;
		token_dashboard(token_symbol);
	})

	// get function for percentage change
	$.get('/percentage', function(data, status) {

		for (token_sym in data) {
			$('#listing-scroll #' + token_sym + ' .pricechange').remove();

			var percentage = data[token_sym].toFixed(2);

			if (percentage > 0) {
				$('#listing-scroll #' + token_sym + ' .listing-info').append(
					'<h6 class="pricechange priceinc">&#9650; ' + Math.abs(percentage) + '%</h6>'
				);
			} else if (percentage == 0) {
				$('#listing-scroll #' + token_sym + ' .listing-info').append(
					'<h6 class="pricechange nochange">&#9644;%</h6>'
				);
			} else {
				$('#listing-scroll #' + token_sym + ' .listing-info').append(
					'<h6 class="pricechange pricedec">&#9660; ' + Math.abs(percentage) + '%</h6>'
				);
			}
		}
	});


	$.get('/token-price', function(data, status) {
		for (token_sym in data) {
			$('#listing-scroll #' + token_sym + ' .listing-price').html('$'+ data[token_sym]);
			// $('#buy').attr('$'+ data[token_sym]);
      //
			// $('#numTokens').html(data[token_sym]);
		}
		});


	// get function for prices SQL

	socket.on('newTradeGraphPoint', function(tokenSym, currenttime, price){
		if (tokenSym == current_token) {
			if (graph_times.length >= 20) {
				graph_times.shift();
				graph_prices.shift();
			}
			graph_times.push(currenttime);
			graph_prices.push(price);
			graph_update(current_token);
		}
	});

	socket.on('updateOrders', function(orderID, tokenSym, time, buyOrSell, price, numTokens){
		if (tokenSym = current_token){
			var time = new Date(time).toLocaleTimeString();

			if (buyOrSell == "sell"){
				$('#sell-list').append($('<li></li>').html(
					'<div id="' + orderID + '" class="sell-time">' + time + '</div><div class="sell-buyorsell">' + buyOrSell + '</div><div class="sell-price">' + price + '</div><div class="sell-numTokens">' + numTokens + '</div>'
				));

			} else if (buyOrSell == "buy"){
				$('#buy-list').append($('<li></li>').html(
					'<div id="' + orderID + '" class="buy-time">' + time + '</div><div class="buy-buyorsell">' + buyOrSell + '</div><div class="buy-price">' + price + '</div><div class="buy-numTokens">' + numTokens + '</div>'
				));
			}
		}
	});

	socket.on('clearOrder', function(buyOrSell, id){
		if (buyOrSell == "sell"){
			// console.log("entering delete sell order");
			$('#sell-list #' + id).remove();

		} else if (buyOrSell == "buy"){
			// console.log("entering delete buy order");
			// console.log(id);
			// console.log($('#buy-list'));
			// console.log($('#buy-list #' + id));
			$('#buy-list #' + id).remove();
		}

	});

	$('#buyForm').submit(function(event) {
		event.preventDefault();

		$.post('/marketsubmit', $('#buyForm').serialize() + '&tokenSym=' + current_token + '&username=' + username, function(err, res) {
			if (err){
				alert(err);
			} else {
				if(res == "Error: not enough tokens on orderbook"){
					alert('Error: not enough tokens on orderbook');
				}
			}
		});

		$('#buyForm')[0].reset();
	});

	$('#sellForm').submit(function(event) {
		event.preventDefault();

		$.post('/marketsubmit', $('#sellForm').serialize() + '&tokenSym=' + current_token + '&username=' + username, function(err, res) {
			if (err){
				alert(err);
			} else {
				if(res == "Error: not enough tokens on orderbook"){
					alert('Error: not enough tokens on orderbook');
				}
			}
		});

		$('#sellForm')[0].reset();
	});

	$('#limit-buy-form').submit(function(event){
		event.preventDefault();

		$.post('/limitsubmit', $('#limit-buy-form').serialize() + '&tokenSym=' + current_token + '&username=' + username, function(err, res){
			if(err){
				console.log(err);
			}
		});

		$('#limit-buy-form')[0].reset();
	});

	$('#limit-sell-form').submit(function(event){
		event.preventDefault();

		$.post('/limitsubmit', $('#limit-sell-form').serialize() + '&tokenSym=' + current_token + '&username=' + username, function(err, res){
			if(err){
				console.log(err);
			}
		});

		$('#limit-sell-form')[0].reset();
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

	// refresh orders list
	refresh_orders(token_symbol);
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

function refresh_orders(token_symbol) {
	$('#buy-list').empty();
	$('#sell-list').empty();

	$.post('/getorders', '&tokenSym=' + token_symbol + '&buyOrSell=buy', function(data, status) {
		data.map(function (order) {
			var time = new Date(order.timestamp_).toLocaleTimeString();

			$('#buy-list').append(
				$('<li></li>').html('<div id="' + order.orderID + '"" class="buy-time">' + time + '</div><div class="buy-buyorsell">buy</div><div class="buy-price">' + order.price + '</div><div class="buy-numTokens">' + order.numTokens + '</div>')
			);
		});
	});

	$.post('/getorders', '&tokenSym=' + token_symbol + '&buyOrSell=sell', function(data, status) {
		// console.log(data);

		data.map(function (order) {
			var time = new Date(order.timestamp_).toLocaleTimeString();

			$('#sell-list').append(
				$('<li></li>').html('<div id="' + order.orderID + '"" class="sell-time">' + time + '</div><div class="sell-buyorsell">sell</div><div class="sell-price">' + order.price + '</div><div class="sell-numTokens">' + order.numTokens + '</div>')
			);
		});
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
			text = text.substring(0, 47);
			text = text.fontsize(3);

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
					$('#articles').append("<li><span>" + time + "</span> " + text + "...</li>");
				}
				if (date != today) {
					date = month+'-'+day+'-'+year;
					$('#articles').append("<li><span>" + date + "</span> " + text + "...</li>");
				}
			}
		});
	})
	Req.send();
}
