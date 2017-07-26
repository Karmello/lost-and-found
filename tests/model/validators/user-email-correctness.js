/* jshint expr: true */

const cm = require('./../../../js/server/server');
const expect = cm.libs.expect;

describe('user email correctness validator', () => {

	let validate;

	before(() => {
		validate = cm.modules.validator.get('User', 'email', 'correctness').validator;
	});

	it('should return false', () => {
		expect(validate()).to.be.false;
		expect(validate(100)).to.be.false;
		expect(validate('')).to.be.false;
		expect(validate(' ')).to.be.false;
		expect(validate('username')).to.be.false;
		expect(validate('username@')).to.be.false;
		expect(validate('@gmail.com')).to.be.false;
	});


	it('should return true', () => {
		expect(validate('username@gmail.com')).to.be.true;
	});
});