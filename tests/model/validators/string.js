/* jshint expr: true */

const cm = require('./../../../js/server/server');
const expect = cm.libs.expect;

describe('string validator', () => {

	let validate;

	describe('noSpecialChars', function() {

		before(() => {
			validate = cm.modules.validator.string.noSpecialChars.validator;
		});

		it('should return false', () => {
			expect(validate('!')).to.be.false;
			expect(validate('@')).to.be.false;
			expect(validate('#')).to.be.false;
			expect(validate('$')).to.be.false;
			expect(validate('%')).to.be.false;
			expect(validate('^')).to.be.false;
			expect(validate('&')).to.be.false;
			expect(validate('*')).to.be.false;
			expect(validate('(')).to.be.false;
			expect(validate(')')).to.be.false;
			expect(validate('-')).to.be.false;
			expect(validate('_')).to.be.false;
			expect(validate('=')).to.be.false;
			expect(validate('+')).to.be.false;
			expect(validate('`')).to.be.false;
			expect(validate('~')).to.be.false;
			expect(validate('\\')).to.be.false;
			expect(validate('|')).to.be.false;
			expect(validate('[')).to.be.false;
			expect(validate('{')).to.be.false;
			expect(validate(']')).to.be.false;
			expect(validate('}')).to.be.false;
			expect(validate(';')).to.be.false;
			expect(validate(':')).to.be.false;
			expect(validate("'")).to.be.false;
			expect(validate('"')).to.be.false;
			expect(validate('<')).to.be.false;
			expect(validate(',')).to.be.false;
			expect(validate('>')).to.be.false;
			expect(validate('.')).to.be.false;
			expect(validate('/')).to.be.false;
			expect(validate('?')).to.be.false;
		});

		it('should return true', () => {
			expect(validate('string with no special characters')).to.be.true;
		});
	});

	describe('noDigits', function() {

		before(() => {
			validate = cm.modules.validator.string.noDigits.validator;
		});

		it('should return false', () => {
			expect(validate('string with a digit 1')).to.be.false;
		});

		it('should return true', () => {
			expect(validate('string with no digits')).to.be.true;
		});
	});

	describe('noMultipleWords', function() {

		before(() => {
			validate = cm.modules.validator.string.noMultipleWords.validator;
		});

		it('should return false', () => {
			expect(validate('multiple word string')).to.be.false;
		});

		it('should return true', () => {
			expect(validate('singlestring')).to.be.true;
		});
	});
});