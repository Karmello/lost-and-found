/* jshint expr: true */

const cm = require('./../../../js/server/server');
const expect = cm.libs.expect;

describe('user username validation', () => {

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

    user.username = undefined;

    user.validate().then(undefined, (err) => {
      expect(Object.keys(err.errors).length).to.equal(1);
      expect(err.errors.username.kind).to.be.equal('required');
      done();
    });
  });

  it('should contain special chars', (done) => {

    user.username = 'username!';

    user.validate().then(undefined, (err) => {
      expect(Object.keys(err.errors).length).to.equal(1);
      expect(err.errors.username.kind).to.be.equal('special_chars_found');
      done();
    });
  });

  it('should contain multiple words', (done) => {

    user.username = 'my new username';

    user.validate().then(undefined, (err) => {
      expect(Object.keys(err.errors).length).to.equal(1);
      expect(err.errors.username.kind).to.be.equal('multiple_words_found');
      done();
    });
  });

  it('should have wrong length', (done) => {

    user.username = '';
    for (let i = 0; i < cm.User.config.username.length.min - 1; i++) { user.username += 'a'; }

    user.validate().then(undefined, (err) => {
      expect(Object.keys(err.errors).length).to.equal(1);
      expect(err.errors.username.kind).to.be.equal('wrong_length');
      done();
    });
  });

  it('should have wrong length', (done) => {

    user.username = '';
    for (let i = 0; i < cm.User.config.username.length.max + 1; i++) { user.username += 'a'; }

    user.validate().then(undefined, (err) => {
      expect(Object.keys(err.errors).length).to.equal(1);
      expect(err.errors.username.kind).to.be.equal('wrong_length');
      done();
    });
  });

  it('should be not unique', (done) => {

    user.save(() => {

      user2.username = user.username;

      user2.validate().then(undefined, (err) => {
        expect(Object.keys(err.errors).length).to.equal(1);
        expect(err.errors.username.kind).to.be.equal('not_unique');
        done();
      });
    });
  });
});