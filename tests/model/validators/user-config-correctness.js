/* jshint expr: true */

const cm = require('./../../../server/server');
const expect = cm.libs.expect;

describe('user config correctness validator', () => {

  let validateLanguage, validateTheme;

  before(() => {
    validateLanguage = cm.modules.validator.get('User', 'configLanguage', 'correctness').validator;
    validateTheme = cm.modules.validator.get('User', 'configTheme', 'correctness').validator;
  });

  it('should return false', () => {

    expect(validateLanguage()).to.be.false;
    expect(validateLanguage('')).to.be.false;
    expect(validateLanguage('notalanguage')).to.be.false;

    expect(validateTheme()).to.be.false;
    expect(validateTheme('')).to.be.false;
    expect(validateTheme('notatheme')).to.be.false;
  });

  it('should return true', () => {

    expect(validateLanguage('en')).to.be.true;
    expect(validateLanguage('pl')).to.be.true;

    expect(validateTheme('standard')).to.be.true;
    expect(validateTheme('raw')).to.be.true;
  });
});