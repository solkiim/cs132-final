var express = require('express');
var path = require('path');

// set up app
var app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname));

// response sendfile helper function
function resSend(response, htmlname) {
	var pagename = '/' + htmlname + '.html';
	response.sendFile(path.join(__dirname + pagename));
}

// routes
app.get('/login', function(request, response) {
	resSend(response, 'login');
});

app.post('/loginsubmit', function(request, response) {
	app.set('username', request.body.username);
	response.redirect('/home');
});

app.get('/home', function(request, response) {
	resSend(response, 'home');
});

app.get('/getusername', function(request, response) {
	response.json({username: app.get('username')});
});

app.get('/market', function(request, response) {
	resSend(response, 'market');
});

app.get('/logout', function(request, response) {
	app.set('username', '');
	response.redirect('/login');
});

app.get('*', function(request, response) {
	resSend(response, '404');
});

app.listen(8080, function() {
	console.log('- Server listening on port 8080');
});
