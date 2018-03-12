/* jshint expr: true */

const cm = require('./../../../server/server');
const expect = cm.libs.expect;

describe('string length validator', () => {

  let validate;

  describe('min', function() {

    before(() => {
      validate = cm.modules.validator.string.length({ min: 5 }).validator;
    });

    it('should return false', function() {
      expect(validate()).to.be.false;
      expect(validate('')).to.be.false;
      expect(validate('abcd')).to.be.false;
    });

    it('should return true', function() {
      expect(validate('abcde')).to.be.true;
      expect(validate('abcdefghijk')).to.be.true;
    });
  });

  describe('max', function() {

    before(() => {
      validate = cm.modules.validator.string.length({ max: 15 }).validator;
    });

    it('should return false', function() {
      expect(validate('abcdefghijklmnop')).to.be.false;
    });

    it('should return true', function() {
      expect(validate('abcdefg')).to.be.true;
    });
  });

  describe('min and max', function() {

    before(() => {
      validate = cm.modules.validator.string.length({ min: 5, max: 15 }).validator;
    });

    it('should return false', function() {
      expect(validate('abcd')).to.be.false;
      expect(validate('abcdefghijklmnop')).to.be.false;
    });

    it('should return true', function() {
      expect(validate('abcde')).to.be.true;
      expect(validate('abcdefghijklmno')).to.be.true;
    });
  });
});