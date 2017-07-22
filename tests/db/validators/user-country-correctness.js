/* jshint expr: true */

const cm = require('./../../../js/server/server');
const expect = cm.libs.expect;

describe('user country correctness validation', () => {

	let checkCountry;

	beforeEach(() => {
		checkCountry = cm.validation.get('User', 'country', 'correctness').validator;
	});

	it('should return false', () => { expect(checkCountry('Not Existing Country')).to.be.false; });
	it('should return true', () => { expect(checkCountry('Poland')).to.be.true; });
});