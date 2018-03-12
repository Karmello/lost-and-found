/* jshint expr: true */

const cm = require('./../../../server/server');
const expect = cm.libs.expect;

describe('user country correctness validator', () => {

  let validate;

  before(() => {
    validate = cm.modules.validator.get('User', 'country', 'correctness').validator;
  });

  it('should return false', () => {
    expect(validate()).to.be.false;
    expect(validate('')).to.be.false;
    expect(validate('Not Existing Country')).to.be.false;
    expect(validate('poland')).to.be.false;
  });

  it('should return true', () => {
    expect(validate('Poland')).to.be.true;
  });
});