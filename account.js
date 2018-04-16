// ----------------------------------- SETUP -----------------------------------

// dependencies
const bcrypt = require('bcrypt');

// ----------------------------------- ROUTES ----------------------------------

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

// signup form submit
exports.signupsubmit = function(pool, req, res) {
	// secure password
	bcrypt.hash(req.body.password, 10, function(err, hash) {
		if (err) {
			console.error(err);
			return res.status(500).send('error updating password');
		}
		
		// make new account
		pool.query('INSERT INTO account VALUES ($1, $2, $3, 0)',
			[req.body.username, hash, req.body.email],
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

// update account's username
exports.updateusername = function(pool, req, res) {
	pool.query('UPDATE account SET username = $1 WHERE username = $2',
		[req.body.newusername, req.body.oldusername],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error updating username');
			}
		}
	);
}

// update account's email
exports.updateemail = function(pool, req, res) {
	pool.query('UPDATE account SET email = $1 WHERE username = $2',
		[req.body.email, req.body.username],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error updating email');
			}
		}
	);
}

// update account's password
exports.updatepassword = function(pool, req, res) {
	// secure password
	bcrypt.hash(req.body.password, 10, function(err, hash) {
		if (err) {
			console.error(err);
			return res.status(500).send('error updating password');
		}
		
		// update account
		pool.query('UPDATE account SET password = $1 WHERE username = $2',
			[hash, req.body.username],
			function(err, data) {
				if (err) {
					console.error(err);
					return res.status(500).send('error updating password');
				}
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
