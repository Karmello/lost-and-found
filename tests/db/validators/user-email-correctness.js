/* jshint expr: true */

const cm = require('./../../../js/server/server');
const expect = cm.libs.expect;

describe('user email correctness validation', () => {

	let validate;

	beforeEach(() => {
		validate = cm.modules.validator.get('User', 'email', 'correctness').validator;
	});

	it('should return false', () => {
		expect(validate()).to.be.false;
	});

	it('should return false', () => {
		expect(validate(100)).to.be.false;
	});

	it('should return false', () => {
		expect(validate('')).to.be.false;
	});

	it('should return false', () => {
		expect(validate(' ')).to.be.false;
	});

	it('should return false', () => {
		expect(validate('username')).to.be.false;
	});

	it('should return false', () => {
		expect(validate('username@')).to.be.false;
	});

	it('should return false', () => {
		expect(validate('@gmail.com')).to.be.false;
	});

	it('should return true', () => {
		expect(validate('username@gmail.com')).to.be.true;
	});
});