var getTime = function() {

	var now = new Date();
	var nowValues = [];

	nowValues[0] = now.getHours();
	nowValues[1] = now.getMinutes();
	nowValues[2] = now.getSeconds();

	for (var i = 0; i < nowValues.length; ++i) {
		if (String(nowValues[i]).length == 1) { nowValues[i] = '0' + nowValues[i]; }
	}

	return nowValues[0] + ':' + nowValues[1] + ':' + nowValues[2];
};

var registerRoutes = function(route) {

	app.get('/' + route, function(req, res) {

		res.header('Content-Type','application/json');
		res.send(JSON.stringify(logs[route], null, 4));
	});

	app.post('/' + route, function(req, res) {

		if (Object.keys(req.body).length > 0) {

			req.body[0] = getTime();
			logs[route].push(req.body);
			console.log(getTime(), '-> /' + route + ' -> log data received');

		} else {
			logs[route] = [];
			console.log(getTime(), '-> /' + route + ' -> log data reset');
		}

		res.end();
	});
};



var logs = require('./scripts/services/logService');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json({}));

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});



var routes = Object.keys(logs);
for (var i = 0; i < routes.length; ++i) { registerRoutes(routes[i]); }

var server = app.listen(7100, function () {
	console.log('----------------------------------------------------------------------------');
	console.log(' logServer listening on localhost' + ':' + server.address().port);
	console.log('----------------------------------------------------------------------------');
	console.log(' Available routes: [' + routes + ']');
	console.log('----------------------------------------------------------------------------');
});