/* jshint expr: true */

const expect = require('chai').expect;

describe('spec1', function() {

	let ms;

	beforeEach(function() {

		ms = require('./../../js/server/server');
	});

	it('ms should be defined', function(done) {

		expect(ms).to.be.defined;
		done();
	});
});