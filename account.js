// ----------------------------------- SETUP -----------------------------------

// dependencies
const bcrypt = require('bcrypt');
var fs = require('fs');
var async = require('async');

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
				+ '(username, password, email, login_tier, firstname, lastname, acctCreationDateTime) '
				+ 'VALUES ($1, $2, $3, $4, $5, $6, $7)',
			[req.body.username, hash, req.body.email, 0, req.body.firstname, req.body.lastname, Date.now()],
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
				return res.status(500).send('error verifying password');
			}
			
			if (data.rows.length == 0) {
				return res.json('that username does not exist');
			}
			
			bcrypt.compare(req.body.password, data.rows[0].password, function(hasherr, hashres) {
				if (hasherr) {
					console.error(err);
					return res.status(500).send('error verifying password');
				}
				
				// return true if password and username match, false otherwise
				return res.json(hashres);
			});
		}
	);
}

// delete account
exports.deleteaccount = function(pool, req, res) {
	pool.query('DELETE FROM account WHERE username=$1',
		[req.body.username],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error deleting account');
			}
			
			res.sendStatus(204);
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
			
			if (data.rows.length == 0) {
				return res.json('that username does not exist');
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
			
			if (data.rows.length == 0) {
				return res.json('that username does not exist');
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
			
			if (data.rows.length == 0) {
				return res.json('that username does not exist');
			}
			
			res.json(data.rows[0].lastname);
		}
	);
}

// get address for given username
exports.getaddress = function(pool, req, res) {
	pool.query('SELECT address FROM account WHERE username=$1',
		[req.body.username],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error getting address');
			}
			
			if (data.rows.length == 0) {
				return res.json('that username does not exist');
			}
			
			res.json(data.rows[0].address);
		}
	);
}

// get address line 2 for given username
exports.getaddress2 = function(pool, req, res) {
	pool.query('SELECT address2 FROM account WHERE username=$1',
		[req.body.username],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error getting address line 2');
			}
			
			if (data.rows.length == 0) {
				return res.json('that username does not exist');
			}
			
			res.json(data.rows[0].address2);
		}
	);
}

// get city for given username
exports.getcity = function(pool, req, res) {
	pool.query('SELECT city FROM account WHERE username=$1',
		[req.body.username],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error getting address city');
			}
			
			if (data.rows.length == 0) {
				return res.json('that username does not exist');
			}
			
			res.json(data.rows[0].city);
		}
	);
}

// get zipcode for given username
exports.getzipcode = function(pool, req, res) {
	pool.query('SELECT zipcode FROM account WHERE username=$1',
		[req.body.username],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error getting address zipcode');
			}
			
			if (data.rows.length == 0) {
				return res.json('that username does not exist');
			}
			
			res.json(data.rows[0].zipcode);
		}
	);
}

// get telephone for given username
exports.gettelephone = function(pool, req, res) {
	pool.query('SELECT telephone FROM account WHERE username=$1',
		[req.body.username],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error getting telephone');
			}
			
			if (data.rows.length == 0) {
				return res.json('that username does not exist');
			}
			
			res.json(data.rows[0].telephone);
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
			res.sendStatus(204);
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
				res.sendStatus(204);
			}
		);
	});
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
			res.sendStatus(204);
		}
	);
}

// set account's name
exports.setname = function(pool, req, res) {
	pool.query('UPDATE account SET firstname = $1, lastname = $2 WHERE username = $3',
		[req.body.firstname, req.body.lastname, req.body.username],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error setting name');
			}
			res.sendStatus(204);
		}
	);
}

// set account's address
exports.setaddress = function(pool, req, res) {
	pool.query('UPDATE account SET address = $1, address2 = $2, city = $3, zipcode = $4 WHERE username = $5',
		[req.body.address, req.body.address2, req.body.city, req.body.zipcode, req.body.username],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error setting name');
			}
			res.sendStatus(204);
		}
	);
}

// set account's telephone
exports.settelephone = function(pool, req, res) {
	pool.query('UPDATE account SET telephone = $1 WHERE username = $2',
		[req.body.telephone, req.body.username],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error setting telephone');
			}
			res.sendStatus(204);
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

// --------------------------------- LOGIN TIER --------------------------------

// get login tier
exports.getlogintier = function(pool, req, res) {
	pool.query('SELECT login_tier FROM account WHERE username=$1',
		[req.body.username],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error getting login tier');
			}
			
			if (data.rows.length == 0) {
				return res.json('that username does not exist');
			}
			
			var logintier_text;
			switch (data.rows[0].login_tier) {
				case 1:
					logintier_text = "email verified";
					break;
				case 2:
					logintier_text = "accredited";
					break;
				case 99:
					logintier_text = "admin";
					break;
				default:
					logintier_text = "email not verified";
			}
			res.json(logintier_text);
		}
	);
}

// set login tier
exports.setlogintier = function(pool, req, res) {
	pool.query('UPDATE account SET zipcode = $1 WHERE username = $2',
		[req.body.zipcode, req.body.username],
		function(err, data) {
			if (err) {
				console.error(err);
				return res.status(500).send('error setting address zipcode');
			}
			res.sendStatus(204);
		}
	);
}

// save login tier file upload
exports.logintierfileupload = function(pool, req, res) {
	// move to folder accreditation-uploads
	var dir = 'accreditation-uploads/' + req.body.username;
	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir);
	}
	req.files.uploadedfile.mv(dir + '/' + req.files.uploadedfile.name, function(err) {
		if (err) {
			console.error(err);
			return res.status(500).send('error uploading file');
		}
		res.sendStatus(204);
	});
}
