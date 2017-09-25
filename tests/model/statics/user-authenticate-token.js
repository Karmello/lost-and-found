/* jshint expr: true */

const cm = require('./../../../js/server/server');
const expect = cm.libs.expect;

describe('user token authentication', () => {

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
      req.query.action = 'authenticate';
      req.body = data[0];
      done();
    });
  });

  it('should return 500', (done) => {

    cm.User.authenticateToken({}, undefined, (status, body) => {
      expect(status).to.equal(500);
      expect(body).to.be.defined;
      done();
    });
  });

  it('should return 400 NO_TOKEN_PROVIDED', (done) => {

    cm.User.authenticateToken(req, undefined, (status, body) => {
      expect(status).to.equal(400);
      expect(body).to.equal('NO_TOKEN_PROVIDED');
      done();
    });
  });

  it('should return 400 TOKEN_AUTHENTICATION_FAILED', (done) => {

    req.query.authToken = 'bad token';

    cm.User.authenticateToken(req, undefined, (status, body) => {
      expect(status).to.equal(400);
      expect(body).to.equal('TOKEN_AUTHENTICATION_FAILED');
      done();
    });
  });

  it('should be authenticated', (done) => {

    req.query.action = 'register';

    cm.actions.user.post.register(req, undefined, (status, body) => {

      req.query.action = 'authenticate';
      req.query.authToken = body.authToken;

      cm.User.authenticateToken(req, undefined, (status, body) => {
        expect(status).to.be.undefined;
        expect(body).to.be.undefined;
        expect(req.decoded._id).to.equal(data[0]._id);
        done();
      });
    });
  });
});