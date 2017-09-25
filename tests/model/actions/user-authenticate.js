/* jshint expr: true */

const cm = require('./../../../js/server/server');
const expect = cm.libs.expect;

describe('user authentication', () => {

  let data, req;

  before((done) => {

    cm.setup.subject = 'User';

    cm.setup.dataFactory.prepare().then((_data) => {
      data = _data;
      done();
    });
  });

  beforeEach((done) => {

    cm.User.remove(() => {

      req = cm.test.helpers.getReqObj();
      req.query.action = 'register';
      req.body = data[0];

      cm.actions.user.post.register(req, undefined, (status, body) => {
        req.query.action = 'authenticate';
        req.query.authToken = body.authToken;
        done();
      });
    });
  });

  it('should not authenticate', (done) => {

    cm.User.remove(() => {
      cm.actions.user.post.authenticate(req, undefined, (status) => {
        expect(status).to.equal(401);
        done();
      });
    });
  });

  it('should authenticate', (done) => {

    cm.actions.user.post.authenticate(req, undefined, (status, body) => {
      expect(status).to.equal(200);
      expect(body).to.have.property('user');
      done();
    });
  });
});