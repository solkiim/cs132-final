describe("Account", function() {
	var request = require('request');
	var server = require('../../server.js');
	var base_url = "http://localhost:8080/";
	
	// -------------------------------- ROUTES ---------------------------------
	describe("routes", function() {
		describe("GET /signup", function() {
			it("returns status code 200", function(done) {
				request.get(base_url + 'signup', function(error, response, body) {
					expect(response.statusCode).toBe(200);
					done();
				});
			});
		});
		
		describe("GET /account", function() {
			it("returns status code 200", function(done) {
				request.get(base_url + 'account', function(error, response, body) {
					expect(response.statusCode).toBe(200);
					done();
				});
			});
		});
	});
	
	// --------------------------- ACCOUNT FUNCTIONS ---------------------------
	describe("account functions", function() {
		// test signup submit before all
		beforeAll(function(done) {
			params = {
				url: base_url + 'signupsubmit',
				form: {
					email: 'test@test.com',
					username: 'test_username',
					password: 'test_password',
					firstname: 'test_firstname',
					lastname: 'test_lastname'
				}
			};
			
			request.post(params, function(error, response, body) {
				expect(response.statusCode).toBe(204);
				done();
			});
		});
		
		afterAll(function(done) {
			params = {
				url: base_url + 'deleteaccount',
				form: {
					username: 'test_username'
				}
			};
			request.post(params, function(error, response, body) {
				expect(response.statusCode).toBe(204);
			});
			
			done();
		});
		
		// verify password
		describe("POST /verifypassword", function() {
			it("returns status code 200", function(done) {
				params = {
					url: base_url + 'verifypassword',
					form: {
						username: 'test_username',
						password: 'test_password',
					}
				};
				
				request.post(params, function(error, response, body) {
					expect(response.statusCode).toBe(200);
					done();
				});
			});
			
			it("returns true for correct password", function(done) {
				params = {
					url: base_url + 'verifypassword',
					form: {
						username: 'test_username',
						password: 'test_password',
					}
				};
				
				request.post(params, function(error, response, body) {
					expect(body).toBe('true');
					done();
				});
			});
			
			it("returns false for incorrect password", function(done) {
				params = {
					url: base_url + 'verifypassword',
					form: {
						email: 'test@test.com',
						username: 'test_username',
						password: 'wrong_password'
					}
				};
				
				request.post(params, function(error, response, body) {
					expect(body).toBe('false');
					done();
				});
			});
		});
	});
	
	// ------------------------- GET AND SET FUNCTIONS -------------------------
	
	describe("get and set functions", function() {
		beforeAll(function(done) {
			params = {
				url: base_url + 'signupsubmit',
				form: {
					email: 'test@test.com',
					username: 'test_username',
					password: 'test_password',
					firstname: 'test_firstname',
					lastname: 'test_lastname'
				}
			};
			// sign up
			request.post(params, function(error, response, body) {
				expect(response.statusCode).toBe(204);
				done();
			});
		});
		
		afterAll(function(done) {
			params = {
				url: base_url + 'deleteaccount',
				form: {
					username: 'test_username'
				}
			};
			request.post(params, function(error, response, body) {
				expect(response.statusCode).toBe(204);
				done();
			});
		});
		
		// set and get email
		describe("POST /setemail and /getemail", function() {
			beforeEach(function(done) {
				get_params = {
					url: base_url + 'getemail',
					form: {
						username: 'test_username'
					}
				};
				
				set_params = {
					url: base_url + 'setemail',
					form: {
						username: 'test_username',
						email: 'test1@test.com'
					}
				};
				
				done();
			});
			
			it("set returns status code 204", function(done) {
				request.post(set_params, function(error, response, body) {
					expect(response.statusCode).toBe(204);
					done();
				});
			});
			
			it("get returns status code 200", function(done) {
				request.post(get_params, function(error, response, body) {
					expect(response.statusCode).toBe(200);
					done();
				});
			});
			
			it("get returns email", function(done) {
				request.post(get_params, function(error, response, body) {
					expect(body).toBe('"test1@test.com"');
					done();
				});
			});
		});
		
		// set and get first name
		describe("POST /setfirstname and /getfirstname", function() {
			beforeEach(function(done) {
				get_params = {
					url: base_url + 'getfirstname',
					form: {
						username: 'test_username'
					}
				};
				
				set_params = {
					url: base_url + 'setfirstname',
					form: {
						username: 'test_username',
						firstname: 'test_firstname_1'
					}
				};
				
				done();
			});
			
			it("set returns status code 204", function(done) {
				request.post(set_params, function(error, response, body) {
					expect(response.statusCode).toBe(204);
					done();
				});
			});
			
			it("get returns status code 200", function(done) {
				request.post(get_params, function(error, response, body) {
					expect(response.statusCode).toBe(200);
					done();
				});
			});
			
			it("get returns firstname", function(done) {
				request.post(get_params, function(error, response, body) {
					expect(body).toBe('"test_firstname_1"');
					done();
				});
			});
		});
		
		// set and get last name
		describe("POST /setlastname and /getlastname", function() {
			beforeEach(function(done) {
				get_params = {
					url: base_url + 'getlastname',
					form: {
						username: 'test_username'
					}
				};
				
				set_params = {
					url: base_url + 'setlastname',
					form: {
						username: 'test_username',
						lastname: 'test_lastname_1'
					}
				};
				
				done();
			});
			
			it("set returns status code 204", function(done) {
				request.post(set_params, function(error, response, body) {
					expect(response.statusCode).toBe(204);
					done();
				});
			});
			
			it("get returns status code 200", function(done) {
				request.post(get_params, function(error, response, body) {
					expect(response.statusCode).toBe(200);
					done();
				});
			});
			
			it("get returns lastname", function(done) {
				request.post(get_params, function(error, response, body) {
					expect(body).toBe('"test_lastname_1"');
					done();
				});
			});
		});
		
		// set and get address
		describe("POST /setaddress and /getaddress", function() {
			beforeEach(function(done) {
				get_params = {
					url: base_url + 'getaddress',
					form: {
						username: 'test_username'
					}
				};
				
				set_params = {
					url: base_url + 'setaddress',
					form: {
						username: 'test_username',
						address: 'test_address'
					}
				};
				
				done();
			});
			
			it("set returns status code 204", function(done) {
				request.post(set_params, function(error, response, body) {
					expect(response.statusCode).toBe(204);
					done();
				});
			});
			
			it("get returns status code 200", function(done) {
				request.post(get_params, function(error, response, body) {
					expect(response.statusCode).toBe(200);
					done();
				});
			});
			
			it("get returns address", function(done) {
				request.post(get_params, function(error, response, body) {
					expect(body).toBe('"test_address"');
					done();
				});
			});
		});
		
		// set and get address line 2
		describe("POST /setaddress2 and /getaddress2", function() {
			beforeEach(function(done) {
				get_params = {
					url: base_url + 'getaddress2',
					form: {
						username: 'test_username'
					}
				};
				
				set_params = {
					url: base_url + 'setaddress2',
					form: {
						username: 'test_username',
						address2: 'test_address2'
					}
				};
				
				done();
			});
			
			it("set returns status code 204", function(done) {
				request.post(set_params, function(error, response, body) {
					expect(response.statusCode).toBe(204);
					done();
				});
			});
			
			it("get returns status code 200", function(done) {
				request.post(get_params, function(error, response, body) {
					expect(response.statusCode).toBe(200);
					done();
				});
			});
			
			it("get returns address line 2", function(done) {
				request.post(get_params, function(error, response, body) {
					expect(body).toBe('"test_address2"');
					done();
				});
			});
		});
		
		// set and get city
		describe("POST /setcity and /getcity", function() {
			beforeEach(function(done) {
				get_params = {
					url: base_url + 'getcity',
					form: {
						username: 'test_username'
					}
				};
				
				set_params = {
					url: base_url + 'setcity',
					form: {
						username: 'test_username',
						city: 'test_city'
					}
				};
				
				done();
			});
			
			it("set returns status code 204", function(done) {
				request.post(set_params, function(error, response, body) {
					expect(response.statusCode).toBe(204);
					done();
				});
			});
			
			it("get returns status code 200", function(done) {
				request.post(get_params, function(error, response, body) {
					expect(response.statusCode).toBe(200);
					done();
				});
			});
			
			it("get returns city", function(done) {
				request.post(get_params, function(error, response, body) {
					expect(body).toBe('"test_city"');
					done();
				});
			});
		});
		
		// set and get zipcode
		describe("POST /setzipcode and /getzipcode", function() {
			beforeEach(function(done) {
				get_params = {
					url: base_url + 'getzipcode',
					form: {
						username: 'test_username'
					}
				};
				
				set_params = {
					url: base_url + 'setzipcode',
					form: {
						username: 'test_username',
						zipcode: '12345'
					}
				};
				
				done();
			});
			
			it("set returns status code 204", function(done) {
				request.post(set_params, function(error, response, body) {
					expect(response.statusCode).toBe(204);
					done();
				});
			});
			
			it("get returns status code 200", function(done) {
				request.post(get_params, function(error, response, body) {
					expect(response.statusCode).toBe(200);
					done();
				});
			});
			
			it("get returns zipcode", function(done) {
				request.post(get_params, function(error, response, body) {
					expect(body).toBe('"12345"');
					done();
				});
			});
		});
		
		// set and get telephone
		describe("POST /settelephone and /gettelephone", function() {
			beforeEach(function(done) {
				get_params = {
					url: base_url + 'gettelephone',
					form: {
						username: 'test_username'
					}
				};
				
				set_params = {
					url: base_url + 'settelephone',
					form: {
						username: 'test_username',
						telephone: '1234567890'
					}
				};
				
				done();
			});
			
			it("set returns status code 204", function(done) {
				request.post(set_params, function(error, response, body) {
					expect(response.statusCode).toBe(204);
					done();
				});
			});
			
			it("get returns status code 200", function(done) {
				request.post(get_params, function(error, response, body) {
					expect(response.statusCode).toBe(200);
					done();
				});
			});
			
			it("get returns telephone", function(done) {
				request.post(get_params, function(error, response, body) {
					expect(body).toBe('1234567890');
					done();
				});
			});
		});
	});
});
