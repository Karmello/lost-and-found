/* jshint expr: true */

const cm = require('./../../../js/server/server');
const expect = cm.libs.expect;

describe('reportEvent address correctness validation', () => {

	let validate, places;

	beforeEach(() => {
		validate = cm.modules.validator.get('ReportEvent', 'address', 'correctness').validator;
		places = require(global.paths.root + '/js/setup/hardcoded/places');
	});

	it('should return false', (done) => {

		let invalidPlace = {
			address: 'some wrong address',
			placeId: '1234',
			lat: 1,
			lng: 1
		};

		validate.call(invalidPlace, invalidPlace.address, (valid) => {
			expect(valid).to.be.false;
			done();
		});
	});

	it('should return true', (done) => {
		validate.call(places[0], places[0].address, (valid) => {
			expect(valid).to.be.true;
			done();
		});
	});
});