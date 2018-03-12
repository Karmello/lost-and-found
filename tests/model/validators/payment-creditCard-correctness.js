/* jshint expr: true */

const cm = require('./../../../server/server');
const expect = cm.libs.expect;

describe('payment creditCard correctness validator', () => {

  let validate;

  describe('type', () => {

    let creditCardTypes;

    before(() => {
      validate = cm.modules.validator.get('Payment', 'creditCardType', 'correctness').validator;
      creditCardTypes = Object.keys(cm.hardData.en.payment.creditCardTypes);
    });

    it('should return false', () => {
      expect(validate('unknown')).to.be.false;
    });

    it('should return true', () => {
      expect(validate(creditCardTypes[0])).to.be.true;
    });
  });

  describe('number', () => {

    before(() => {
      validate = cm.modules.validator.get('Payment', 'creditCardNumber', 'correctness').validator;
    });

    it('should return false', () => {
      expect(validate('invalid')).to.be.false;
      expect(validate('abcdefghijklmno')).to.be.false;
    });

    it('should return true', () => {
      expect(validate('111122223333')).to.be.true;
      expect(validate('1111222233334444555')).to.be.true;
    });
  });

  describe('expireMonth', () => {

    before(() => {
      validate = cm.modules.validator.get('Payment', 'creditCardExpireMonth', 'correctness').validator;
    });

    it('should return false', () => {
      expect(validate(0)).to.be.false;
    });

    it('should return true', () => {
      expect(validate(1)).to.be.true;
      expect(validate('09')).to.be.true;
      expect(validate(12)).to.be.true;
    });
  });

  describe('expireYear', () => {

    before(() => {
      validate = cm.modules.validator.get('Payment', 'creditCardExpireYear', 'correctness').validator;
    });

    it('should return false', () => {
      expect(validate('1')).to.be.false;
    });

    it('should return true', () => {
      expect(validate('0000')).to.be.true;
      expect(validate('2017')).to.be.true;
      expect(validate(2017)).to.be.true;
    });
  });

  describe('cvv2', () => {

    before(() => {
      validate = cm.modules.validator.get('Payment', 'cvv2', 'correctness').validator;
    });

    it('should return false', () => {
      expect(validate('12')).to.be.false;
      expect(validate('12345')).to.be.false;
    });

    it('should return true', () => {
      expect(validate('123')).to.be.true;
      expect(validate('4860')).to.be.true;
      expect(validate('0123')).to.be.true;
    });
  });
});