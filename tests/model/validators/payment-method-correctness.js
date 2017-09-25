/* jshint expr: true */

const cm = require('./../../../js/server/server');
const expect = cm.libs.expect;

describe('payment method correctness validator', () => {

  let validate, methods;

  before(() => {
    validate = cm.modules.validator.get('Payment', 'method', 'correctness').validator;
    methods = cm.hardData.en.payment.methods;
  });

  it('should return false', () => {
    expect(validate('unknown')).to.be.false;
  });

  it('should return true', () => {
    expect(validate(Object.keys(methods)[0])).to.be.true;
  });
});