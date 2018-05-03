# Parallel Testing

## Front End HTML/CSS
All testing was done through the W3C HTML and CSS Validation Service.

### account.html

- **Problem:** Line 50 and 68: there are duplicate IDs in this HTML file. The first occurrence of id="username" occurred on line 50 then line 68.
	- **Solution:** Changed the second id to id="username-field".

### 404.html

- No errors or warnings to show.

### index.html

- **Problem:** Lines 64, and 171: an < img > element must have an "alt" attribute.
	- **Solution:** Fixed the issue by giving each img an alt describing what the img is.

- **Problem:** Line 198, 200, 220, 222, 243, 245: the "for" attribute of the < label > elements must refer to a non-hidden form control. The problem was because the "for" attribute must match the "id" attribute value of another form control.
	- **Solution:** We had originally labeled it as a class but gave each form input and their respective label a unique id.

### signup.html

- No errors or warnings to show.

### css.css

- No errors or warnings to show.


## User Testing

We essentially asked questions about the visual hierarchy of information and how intuitive the dashboard was. Overall, users commented on how simple the platform was an gave feedback on various details of the platform.

### Feedback:

- Why there was a Trade and Trades panel
- Seeing more of the headline/the full headline
- How we were going to display different dates for older news / is there a way to look at archives of news?
- There are more headlines outside of the div
- Why there were dates mixed in with the times - which is newer or is it random?
- Having the trades highlight in red or green like other platforms
- Whether or not there would be more listings


### Fixes:

- Changed Trade to Orders
- Set the overflow to scroll in the News panel

## Account

### Routes:
All tests passed.

- GET /signup
	- returns status code 200
- GET /account
	- returns status code 200

### Account Functions
All tests passed.

Test account made before all tests in group and deleted after all tests in group.

- POST /verifypassword
	- returns status code 200
	- returns true for correct password
	- returns false for incorrect password
- signup
- delete account

### Get and Set Functions
All tests passed.

Test account made before all tests in group and deleted after all tests in group.

- POST /setemail and /getemail
	- set returns status code 204
	- get returns status code 200
	- get returns email

The above was duplicated for firstname, lastname, address, addressline2, city, zipcode, and telephone.

**Problem:** Many of the `set` function unit tests (e.g., testing `/setaddress`) failed with the error:

	Account get and set functions POST /setaddress and /getaddress returns status code 204
	Message:
	Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.

The functions weren't terminating because they only returned a status on error and did not do anything on success, like such:

	app.post('/setaddress', function(req, res) {
		pool.query('UPDATE account SET address = $1 WHERE username = $2',
			[req.body.address, req.body.username],
			function(err, data) {
				if (err) {
					console.error(err);
					return res.status(500).send('error setting address');
				}
			}
		);
	});

To fix this, `res.sendStatus(204)` was added after the error checking statement:

	app.post('/setaddress', function(req, res) {
		pool.query('UPDATE account SET address = $1 WHERE username = $2',
			[req.body.address, req.body.username],
			function(err, data) {
				if (err) {
					console.error(err);
					return res.status(500).send('error setting address');
				}

				// FIX HERE!
				res.sendStatus(204);
			}
		);
	});

## Lauti Testing

I was in charge of creating the graph and the news feed, and used APIs for both.
Given that it is front end and API usage, I will document my testing here.

### News Feed
I tested this by fetching news for different companies, making sure that each
article presented has the company name in the headline. I also made sure that
the dates are in chronological order, and only the required amount of articles
are presented on the page. I also made sure that the news that is from the
current day have the time displayed, while news that is from a different day
have the day of the article displayed. New news is fetched every 10 seconds,
using the google news api.
While testing this I ran into an error that came from calling a function twice,
therefore news articles were being displayed repeatedly. Another error was that
the last news article was being displayed twice. I was able to fix this by
cleaning up the code and using pop and unshift for arrays instead of splice.



### Price Graph
I tested the graph by inputting data into the corresponding tables, and viewing
the graph when the page loads. Also, the title of the graph can be changed
depending on the current token that should be displayed.
I fixed an error that caused the graph to become smaller.

```
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
```

## Rhaime Testing

### Trading

I have been working on making the trading happen (market and limit orders). Market and limit orders are different types of trades you can place. I have two post requests and the rest mainly handle the logic for when and how to execute a market and limit order, and how to fill in the orders depending on which orders are available. I am still debugging the logic right now and so I have written some tests but mainly working on the debugging at the moment.

### Testing

Testing the actual logic for the functionality is challenging using Jasmine, but can be done directly on server.js. What I am doing in my code directly on server.js is clearning the SQL tables, then manually inserting a test set of limit orders to fill in a buy and sell table, then executing market orders and limit orders on the orderbook to ensure that orders are being filled in the appropriate manner.

I have not found it to be possible to directly test the logic through Jasmine, since you need to work with a cleared database to make sure that the logic is working properly on a test set of orders, and the method I am using right now cannot be rolled out since you would never want to clear the database once you have pushed the product.

The Jasmine testing covers the post requests are going through and that the logic for my one helper function is executing as planned. The tests can be found in spec/trade-testing.js.
