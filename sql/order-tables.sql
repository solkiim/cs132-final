CREATE TABLE IF NOT EXISTS Token (
	tokenSymbol			VARCHAR(5) NOT NULL,
	tokenName			VARCHAR(20) NOT NULL,
	sharePrice			FLOAT(2) NOT NULL,
	numAvailTokens		INTEGER NOT NULL,
	PRIMARY KEY (tokenSymbol),
	UNIQUE (tokenName)
);

-- want buy and sell to go from HIGHEST ----> to LOWEST price

CREATE TABLE IF NOT EXISTS Buy (

	orderID				INTEGER AUTO_INCREMENT,
	tokenSymbol			VARCHAR(5) NOT NULL,
	buyOrSell			TEXT NOT NULL,
	orderType			VARCHAR(4) NOT NULL,
	-- either num tokens OR price should be filled
	numTokens         	INTEGER,
	-- order price from highest -> lowest
	price         		ORDER BY INTEGER DESC,
	username			TEXT,
	timestamp_			DATETIME DEFAULT NOW() NOT NULL,
	completed			BOOLEAN DEFAULT 0,
	PRIMARY KEY (orderID)

);

CREATE TABLE IF NOT EXISTS Sell (

	orderID				INTEGER AUTO_INCREMENT,
	tokenSymbol			VARCHAR(5) NOT NULL,
	buyOrSell			TEXT NOT NULL,
	orderType			VARCHAR(4) NOT NULL,
	-- either num tokens OR price should be filled
	numTokens         	INTEGER,
	-- order price from highest -> lowest
	price         		ORDER BY INTEGER DESC,
	username			TEXT,
	timestamp_			DATETIME DEFAULT NOW() NOT NULL,
	completed			BOOLEAN DEFAULT 0,
	PRIMARY KEY (orderID)

);

CREATE TABLE IF NOT EXISTS Trades (

	orderID				INTEGER AUTO_INCREMENT,
	tokenSymbol			VARCHAR(5) NOT NULL,
	orderType			VARCHAR(4) NOT NULL,
	-- either num tokens OR price should be filled
	numTokens         	INTEGER,
	price         		INTEGER,
	username			TEXT,
	timestamp_			DATETIME DEFAULT NOW() NOT NULL,
	completed			BOOLEAN DEFAULT 0,
	PRIMARY KEY (orderID)
);


CREATE TABLE IF NOT EXISTS Transaction (
	id       			INTEGER AUTO_INCREMENT,
	pricePerShare		FLOAT(2),
	txnFee				FLOAT(2),
	timestamp_			DATETIME DEFAULT NOW() NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS TokenOrderHistory (
	tokenSymbol			VARCHAR(5),
	orderID				INTEGER,
	tokenPrice			FLOAT(2),
	timestamp_			DATETIME DEFAULT NOW().
	PRIMARY KEY (tokenSymbol, timestamp_)
);
