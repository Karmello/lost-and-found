/* jshint expr: true */

const cm = require('./../../../server/server');
const expect = cm.libs.expect;

describe('user deleting', () => {

  let users, deactivationReasons, req;

  before((done) => {

    cm.setup.subject = 'User';

    cm.setup.dataFactory.prepare().then((data) => { users = data;
      cm.DeactivationReason.find({}, (err, data) => { deactivationReasons = data;
        done();
      });
    });
  });

  beforeEach((done) => {
    cm.User.remove(() => {
      req = cm.test.helpers.getReqObj();
      req.query.action = 'register';
      req.body = users[0];
      cm.actions.user.post.register(req, undefined, () => { done(); });
    });
  });

  it('should return 400', (done) => {

    req = cm.test.helpers.getReqObj();
    req.decoded._id = users[0]._id;

    cm.actions.user.delete(req, undefined, (status) => {
      expect(status).to.equal(400);
      done();
    });
  });

  it('should return 400', (done) => {

    req = cm.test.helpers.getReqObj();
    req.decoded._id = users[1]._id;
    req.query.deactivationReasonId = deactivationReasons[0]._id;

    cm.actions.user.delete(req, undefined, (status) => {
      expect(status).to.equal(400);
      done();
    });
  });

  it('should return 204', (done) => {

    req = cm.test.helpers.getReqObj();
    req.decoded._id = users[0]._id;
    req.query.deactivationReasonId = deactivationReasons[0]._id;

    cm.actions.user.delete(req, undefined, (status) => {
      expect(status).to.equal(204);
      done();
    });
  });
});