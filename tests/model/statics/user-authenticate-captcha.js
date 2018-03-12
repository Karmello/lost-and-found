/* jshint expr: true */

const cm = require('./../../../server/server');
const expect = cm.libs.expect;

describe('user captcha authentication', () => {

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
      done();
    });
  });

  it('should return 500 NO_BAD_ACTIONS_COUNT_OBJECT', (done) => {

    delete req.session.badActionsCount;

    cm.User.authenticateCaptchaRes(req, undefined, (status, body) => {
      expect(status).to.equal(500);
      expect(body).to.equal('NO_BAD_ACTIONS_COUNT_OBJECT');
      done();
    });
  });

  it('should have no need for authentication', (done) => {

    req.query.action = 'login';

    cm.User.authenticateCaptchaRes(req, undefined, (status, body) => {
      expect(status).to.be.undefined;
      expect(body).to.be.undefined;
      done();
    });
  });

  it('should return 400 NO_CAPTCHA_RESPONSE_PROVIDED', function(done) {

    req.query.action = 'login';
    req.session.badActionsCount.login = 6;

    cm.User.authenticateCaptchaRes(req, undefined, (status, body) => {
      expect(status).to.equal(400);
      expect(body).to.equal('NO_CAPTCHA_RESPONSE_PROVIDED');
      done();
    });
  });
});