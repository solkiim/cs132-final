CREATE TABLE IF NOT EXISTS account (
	username TEXT PRIMARY KEY,
	password TEXT NOT NULL,
	email TEXT NOT NULL,
	login_tier INTEGER, -- 0:email not verified, 1:email verified, 2:accredited, 99:admin
	lastName TEXT,
	firstName TEXT,
	address TEXT,
	city TEXT,
	zipcode TEXT,
	telephone INTEGER,
	acctCreationDate INTEGER,
	portfolio TEXT,
);

CREATE TABLE IF NOT EXISTS favorite_stock (
	username TEXT NOT NULL,
	tokenSymbol VARCHAR(5),
	PRIMARY KEY (username, tokenSymbol)
);
