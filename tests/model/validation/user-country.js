/* jshint expr: true */

const cm = require('./../../../js/server/server');
const expect = cm.libs.expect;

describe('user country validation', () => {

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

    user.country = undefined;

    user.validate().then(undefined, (err) => {
      expect(Object.keys(err.errors).length).to.equal(1);
      expect(err.errors.country.kind).to.be.equal('required');
      done();
    });
  });

  it('should be incorrect', (done) => {

    user.country = 'Notacountryname';

    user.validate().then(undefined, (err) => {
      expect(Object.keys(err.errors).length).to.equal(1);
      expect(err.errors.country.kind).to.be.equal('incorrect');
      done();
    });
  });
});