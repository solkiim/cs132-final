# CS132 Lab 9 README

## Overview
Backend account functions tested

## Tests

### Routes

- GET /signup
	- returns status code 200
- GET /account
	- returns status code 200

### Account Functions
Test account made before all tests in group and deleted after all tests in group.

- POST /verifypassword
	- returns status code 200
	- returns true for correct password
	- returns false for incorrect password
- signup
- delete account

### Get and Set Functions
Test account made before all tests in group and deleted after all tests in group.

- POST /setemail and /getemail
	- set returns status code 204
	- get returns status code 200
	- get returns email
- POST /setfirstname and /getfirstname
	- set returns status code 204
	- get returns status code 200
	- get returns first name
- POST /setlastname and /getlastname
	- set returns status code 204
	- get returns status code 200
	- get returns last name
- POST /setaddress and /getaddress
	- set returns status code 204
	- get returns status code 200
	- get returns address
- POST /setaddress2 and /getaddress2
	- set returns status code 204
	- get returns status code 200
	- get returns address line 2
- POST /setcity and /getcity
	- set returns status code 204
	- get returns status code 200
	- get returns city
- POST /setzipcode and /getzipcode
	- set returns status code 204
	- get returns status code 200
	- get returns zipcode
- POST /settelephone and /gettelephone
	- set returns status code 204
	- get returns status code 200
	- get returns telephone

## Results

	> jasmine
	Started
	.............................
	29 specs, 0 failures
	Finished in 0.638 seconds

## Fixes

### Function Termination
Many of my `set` function unit tests (e.g., testing `/setaddress`) failed with the error:

	Account get and set functions POST /setaddress and /getaddress returns status code 204
	Message:
	Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.

I realized that the functions never terminated because they only returned a status on error and did not do anything on success, like such:

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

To fix this, I added `res.sendStatus(204)` after the error checking statement:

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


## Collaboration
None
