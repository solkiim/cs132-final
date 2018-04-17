// ----------------------------------- SETUP -----------------------------------

// dependencies
const bcrypt = require('bcrypt');

// ----------------------------------- ROUTES ----------------------------------



// signup form submit
exports.signupsubmit = function(pool, req, res) {
	// secure password
	bcrypt.hash(req.body.password, 10, function(err, hash) {
		if (err) {
			console.error(err);
			return res.status(500).send('error updating password');
		}
		
		// make new account
		pool.query(
			'INSERT INTO account '
				+ '(username, password, email, login_tier, lastname, firstName, acctCreationDateTime) '
				+ 'VALUES ($1, $2, $3, $4, $5, $6, $7)',
			[req.body.username, hash, req.body.email, 0, req.body.lastname, req.body.firstName, Date.now()],
			function(err, data) {
				if (err) {
					console.error(err);
					return res.status(500).send('error signing up');
				}
				res.sendStatus(204);
			}
		);
	});
}

// verify password for username
exports.verifypassword = function(pool, req, res) {
	pool.query('SELECT * FROM account WHERE username=$1',
		[req.body.username],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error checking duplicate email');
			}
			
			if (data.rows.length == 0) {
				return res.json('that username does not exist');
			}
			
			bcrypt.compare(req.body.password, data.rows[0].password, function(hasherr, hashres) {
				if (hasherr) {
					console.error(err);
					return res.status(500).send('error checking duplicate email');
				}
				
				// return true if password and username match, false otherwise
				return res.json(hashres);
			});
		}
	);
}

// ------------------------------- GET FUNCTIONS -------------------------------

// get email for given username
exports.getemail = function(pool, req, res) {
	pool.query('SELECT email FROM account WHERE username=$1',
		[req.body.username],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error getting email');
			}
			res.json(data.rows[0].email);
		}
	);
}

// get first name for given username
exports.getfirstname = function(pool, req, res) {
	pool.query('SELECT firstname FROM account WHERE username=$1',
		[req.body.username],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error getting first name');
			}
			res.json(data.rows[0].firstname);
		}
	);
}

// get last name for given username
exports.getlastname = function(pool, req, res) {
	pool.query('SELECT lastname FROM account WHERE username=$1',
		[req.body.username],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error getting last name');
			}
			res.json(data.rows[0].lastname);
		}
	);
}


// ------------------------------- SET FUNCTIONS -------------------------------

// update account's username
exports.setusername = function(pool, req, res) {
	pool.query('UPDATE account SET username = $1 WHERE username = $2',
		[req.body.newusername, req.body.oldusername],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error setting username');
			}
		}
	);
}

// update account's email
exports.setemail = function(pool, req, res) {
	pool.query('UPDATE account SET email = $1 WHERE username = $2',
		[req.body.email, req.body.username],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error setting email');
			}
		}
	);
}

// update account's password
exports.setpassword = function(pool, req, res) {
	// secure password
	bcrypt.hash(req.body.password, 10, function(err, hash) {
		if (err) {
			console.error(err);
			return res.status(500).send('error setting password');
		}
		
		// update account
		pool.query('UPDATE account SET password = $1 WHERE username = $2',
			[hash, req.body.username],
			function(err, data) {
				if (err) {
					console.error(err);
					return res.status(500).send('error setting password');
				}
			}
		);
	});
}

// set account's first name
exports.setfirstname = function(pool, req, res) {
	pool.query('UPDATE account SET firstname = $1 WHERE username = $2',
		[req.body.first, req.body.username],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error setting first name');
			}
		}
	);
}

// set account's last name
exports.setlastname = function(pool, req, res) {
	pool.query('UPDATE account SET lastname = $1 WHERE username = $2',
		[req.body.lastname, req.body.username],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error setting last name');
			}
		}
	);
}

// ------------------------- DUPLICATE CHECK FUNCTIONS -------------------------

// check if username already exists
exports.duplicateusername = function(pool, req, res) {
	pool.query('SELECT * FROM account WHERE username=$1',
		[req.body.username],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error checking duplicate username');
			}
			
			// return true if duplicate, false otherwise
			return res.json(data.rows.length > 0);
		}
	);
}

// check if email already exists
exports.duplicateemail = function(pool, req, res) {
	pool.query('SELECT * FROM account WHERE email=$1',
		[req.body.email],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error checking duplicate email');
			}
			
			// return true if duplicate, false otherwise
			return res.json(data.rows.length > 0);
		}
	);
}
