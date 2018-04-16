
CREATE TABLE account (

	username			TEXT PRIMARY KEY,
	password			TEXT NOT NULL,
	email				TEXT NOT NULL,
	login_tier 			INTEGER, -- 0:email not verified, 1:email verified, 2:accredited, 99: admin
	lastName			TEXT,
	firstName			TEXT,
	address				TEXT,
	city				TEXT,
	zipcode				TEXT,
	telephone			TEXT,
	acctCreationDate	TEXT,
	portfolio			TEXT,
	favoriteStocks		TEXT,

);

CREATE TABLE favorite_stock (

	username		TEXT,
	tokenSymbol		VARCHAR(5), -- changed from stock_code
	PRIMARY KEY (username, stock_code)

);

