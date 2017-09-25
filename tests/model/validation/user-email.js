/* jshint expr: true */

const cm = require('./../../../js/server/server');
const expect = cm.libs.expect;

describe('user email validation', () => {

  let data, user, user2;

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
      user2 = new cm.User(data[1]);
      done();
    });
  });

  it('should be required', (done) => {

    user.email = undefined;

    user.validate().then(undefined, (err) => {
      expect(Object.keys(err.errors).length).to.equal(1);
      expect(err.errors.email.kind).to.be.equal('required');
      done();
    });
  });

  it('should be incorrect', (done) => {

    user.email = 'wrong_email';

    user.validate().then(undefined, (err) => {
      expect(Object.keys(err.errors).length).to.equal(1);
      expect(err.errors.email.kind).to.be.equal('incorrect');
      done();
    });
  });

  it('should have wrong length', (done) => {

    user.email = '';
    for (let i = 0; i < 33; i++) { user.email += 'username'; }
    user.email += '@gmail.com';

    user.validate().then(undefined, (err) => {
      expect(Object.keys(err.errors).length).to.equal(1);
      expect(err.errors.email.kind).to.be.equal('wrong_length');
      done();
    });
  });

  it('should be not unique', (done) => {

    user.save(() => {

      user2.email = user.email;

      user2.validate().then(undefined, (err) => {
        expect(Object.keys(err.errors).length).to.equal(1);
        expect(err.errors.email.kind).to.be.equal('not_unique');
        done();
      });
    });
  });
});