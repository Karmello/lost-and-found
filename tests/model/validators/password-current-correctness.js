/* jshint expr: true */

const cm = require('./../../../server/server');
const expect = cm.libs.expect;

describe('password current correctness validator', () => {

  let validate, users;

  before((done) => {

    validate = cm.modules.validator.get('Password', 'current', 'correctness').validator;
    cm.setup.subject = 'User';

    cm.setup.dataFactory.prepare().then((_users) => {
      users = _users;
      done();
    });
  });

  beforeEach((done) => {
    cm.User.remove(() => { new cm.User(users[0]).save(() => { done(); }); });
  });

  it('should return false', (done) => {

    let password = {
      userId: users[0]._id,
      current: 'wrong_password'
    };

    validate.call(password, password.current, (valid) => {
      expect(valid).to.be.false;
      done();
    });
  });

  it('should return true', (done) => {

    let password = {
      userId: users[0]._id,
      current: users[0].password
    };

    validate.call(password, password.current, (valid) => {
      expect(valid).to.be.true;
      done();
    });
  });
});