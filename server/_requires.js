var _requires = {
	http: require('http'),
	restful: require('node-restful'),
	mongoose: require('mongoose'),
	express: require('express'),
	session: require('express-session'),
	Promise: require('promise'),
	_: require('lodash'),
	morgan: require('morgan'),
	bodyParser: require('body-parser'),
	methodOverride: require('method-override'),
	querystring: require('querystring'),
	https: require('https'),
	nodemailer: require('nodemailer'),
	jwt: require('jsonwebtoken'),
	bcrypt: require('bcrypt-nodejs'),
	crypto: require('crypto'),
	aws: require('aws-sdk'),
	io: require('socket.io'),
	paypal: require('paypal-rest-sdk')
};

_requires.MongoStore = require('connect-mongo')(_requires.session);
module.exports = _requires;