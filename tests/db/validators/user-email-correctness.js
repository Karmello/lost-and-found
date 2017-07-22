/* jshint expr: true */

const cm = require('./../../../js/server/server');
const expect = cm.libs.expect;

describe('user email correctness validation', () => {

	let checkEmail;

	beforeEach(() => {
		checkEmail = cm.validation.get('User', 'email', 'correctness').validator;
	});

	it('should return false', () => { expect(checkEmail()).to.be.false; });
	it('should return false', () => { expect(checkEmail(100)).to.be.false; });
	it('should return false', () => { expect(checkEmail('')).to.be.false; });
	it('should return false', () => { expect(checkEmail(' ')).to.be.false; });
	it('should return false', () => { expect(checkEmail('username')).to.be.false; });
	it('should return false', () => { expect(checkEmail('username@')).to.be.false; });
	it('should return false', () => { expect(checkEmail('@gmail.com')).to.be.false; });
	it('should return true', () => { expect(checkEmail('username@gmail.com')).to.be.true; });
});