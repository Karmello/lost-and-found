/* jshint expr: true */

const cm = require('./../../../server/server');
const expect = cm.libs.expect;

describe('user logging in', () => {

  let data, req;

  before((done) => {

    cm.setup.subject = 'User';

    cm.setup.dataFactory.prepare().then((_data) => {

      data = _data;

      cm.User.remove(() => {

        req = cm.test.helpers.getReqObj();
        req.query.action = 'register';
        req.body = data[0];

        cm.actions.user.post.register(req, undefined, () => {
          done();
        });
      });
    });
  });

  beforeEach((done) => {
    req = cm.test.helpers.getReqObj();
    req.query.action = 'login';
    done();
  });

  it('should return 400 wrong_credentials', (done) => {

    req.body = data[1];

    cm.actions.user.post.login(req, undefined, (status, body) => {

      expect(status).to.equal(400);
      expect(body.errors.username.kind).to.equal('wrong_credentials');
      expect(req.session.badActionsCount.login).to.equal(1);
      done();
    });
  });

  it('should return 400 wrong_credentials', (done) => {

    req.body.password = 'wrong_password';

    cm.actions.user.post.login(req, undefined, (status, body) => {

      expect(status).to.equal(400);
      expect(body.errors.username.kind).to.equal('wrong_credentials');
      expect(req.session.badActionsCount.login).to.equal(1);
      done();
    });
  });

  it('should login', (done) => {

    req.body = data[0];

    cm.actions.user.post.login(req, undefined, (status, body) => {

      expect(status).to.equal(200);
      expect(body).to.have.property('user');
      expect(body).to.have.property('authToken');
      expect(body.user._id.toString()).to.equal(data[0]._id.toString());
      done();
    });
  });
});