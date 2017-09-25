/* jshint expr: true */

const cm = require('./../../../js/server/server');
const expect = cm.libs.expect;

describe('user password validation', () => {

  let data, user;

  before((done) => {

    cm.setup.subject = 'User';

    cm.setup.dataFactory.prepare().then((_data) => {
      data = _data;
      done();
    });
  });

  beforeEach((done) => {
    cm.User.remove(() => {
      user = new cm.User(data[0]);
      done();
    });
  });

  it('should be required', (done) => {

    user.password = undefined;

    user.validate().then(undefined, (err) => {
      expect(Object.keys(err.errors).length).to.equal(1);
      expect(err.errors.password.kind).to.be.equal('required');
      done();
    });
  });

  it('should contain special chars', (done) => {

    user.password = 'pass@word#';

    user.validate().then(undefined, (err) => {
      expect(Object.keys(err.errors).length).to.equal(1);
      expect(err.errors.password.kind).to.be.equal('special_chars_found');
      done();
    });
  });

  it('should contain multiple words', (done) => {

    user.password = 'multiple word password';

    user.validate().then(undefined, (err) => {
      expect(Object.keys(err.errors).length).to.equal(1);
      expect(err.errors.password.kind).to.be.equal('multiple_words_found');
      done();
    });
  });

  it('should have wrong length', (done) => {

    user.password = '';
    for (let i = 0; i < cm.User.config.password.length.min - 1; i++) { user.password += 'a'; }

    user.validate().then(undefined, (err) => {
      expect(Object.keys(err.errors).length).to.equal(1);
      expect(err.errors.password.kind).to.be.equal('wrong_length');
      done();
    });
  });

  it('should have wrong length', (done) => {

    user.password = '';
    for (let i = 0; i < cm.User.config.password.length.max + 1; i++) { user.password += 'a'; }

    user.validate().then(undefined, (err) => {
      expect(Object.keys(err.errors).length).to.equal(1);
      expect(err.errors.password.kind).to.be.equal('wrong_length');
      done();
    });
  });
});