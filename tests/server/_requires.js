var server = require('./../../server');
var _requires = require(global.paths._requires);

_requires.helpers = require(global.paths.tests + 'server/helpers');
_requires.Response = require(global.paths.tests + 'server/Response');

_requires.chai = require('chai');
_requires.should = require('should');
_requires.expect = _requires.chai.expect;

module.exports = _requires;