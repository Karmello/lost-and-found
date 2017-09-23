/* jshint expr: true */

const cm = require('./../../../js/server/server');
const expect = cm.libs.expect;

describe('number validator', () => {

	let validate;

	describe('isInteger', function() {

		before(() => {
			validate = cm.modules.validator.number.isInteger.validator;
		});

		it('should return false', () => {
			expect(validate('text')).to.be.false;
			expect(validate('5.5')).to.be.false;
			expect(validate(5.5)).to.be.false;
		});

		it('should return true', () => {
			expect(validate(10)).to.be.true;
		});
	});

	describe('isPositive', function() {

		before(() => {
			validate = cm.modules.validator.number.isPositive.validator;
		});

		it('should return false', () => {
			expect(validate(-1)).to.be.false;
			expect(validate(0)).to.be.false;
		});

		it('should return true', () => {
			expect(validate(1)).to.be.true;
			expect(validate(5)).to.be.true;
			expect(validate('5')).to.be.true;
		});
	});

	describe('isNotNegative', function() {

		before(() => {
			validate = cm.modules.validator.number.isNotNegative.validator;
		});

		it('should return false', () => {
			expect(validate(-1)).to.be.false;
			expect(validate(-0.5)).to.be.false;
		});

		it('should return true', () => {
			expect(validate(0)).to.be.true;
			expect(validate(0.5)).to.be.true;
			expect(validate(1)).to.be.true;
		});
	});
});