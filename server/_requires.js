var _requires = {
	_: require('lodash'),
	aws: require('aws-sdk'),
	bcrypt: require('bcrypt-nodejs'),
	bodyParser: require('body-parser'),
	crypto: require('crypto'),
	express: require('express'),
	http: require('http'),
	https: require('https'),
	socketIO: require('socket.io'),
	jwt: require('jsonwebtoken'),
	methodOverride: require('method-override'),
	mongoose: require('mongoose'),
	morgan: require('morgan'),
	nodemailer: require('nodemailer'),
	paypal: require('paypal-rest-sdk'),
	Promise: require('promise'),
	restful: require('node-restful'),
	request: require('request'),
	session: require('express-session'),
	querystring: require('querystring')
};

_requires.MongoStore = require('connect-mongo')(_requires.session);
module.exports = _requires;