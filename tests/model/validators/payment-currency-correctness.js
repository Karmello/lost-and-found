/* jshint expr: true */

const cm = require('./../../../server/server');
const expect = cm.libs.expect;

describe('payment currency correctness validator', () => {

  let validate, currencies;

  before(() => {
    validate = cm.modules.validator.get('Payment', 'currency', 'correctness').validator;
    currencies = cm.hardData.en.payment.currencies;
  });

  it('should return false', () => {
    expect(validate('unknown')).to.be.false;
  });

  it('should return true', () => {
    expect(validate(currencies[0].value)).to.be.true;
  });
});