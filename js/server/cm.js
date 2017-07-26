const cm = {
	libs: {
		_: require('lodash'),
		aws: require('aws-sdk'),
		bcrypt: require('bcrypt-nodejs'),
		bodyParser: require('body-parser'),
		crypto: require('crypto'),
		chai: require('chai'),
		express: require('express'),
		fs: require('fs'),
		googleMaps: require('@google/maps'),
		http: require('http'),
		https: require('https'),
		socketIO: require('socket.io'),
		jwt: require('jsonwebtoken'),
		methodOverride: require('method-override'),
		mongoose: require('mongoose'),
		morgan: require('morgan'),
		nodemailer: require('nodemailer'),
		path: require('path'),
		paypal: require('paypal-rest-sdk'),
		Promise: require('promise'),
		restful: require('node-restful'),
		request: require('request'),
		session: require('express-session'),
		querystring: require('querystring')
	}
};

cm.libs.MongoStore = require('connect-mongo')(cm.libs.session);

if (process.env.LOADED_MOCHA_OPTS) {
	cm.libs.expect = cm.libs.chai.expect;
	cm.test = { helpers: require('./../../tests/_helpers') };
}

module.exports = cm;