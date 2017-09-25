/* jshint expr: true */

const cm = require('./../../../js/server/server');
const expect = cm.libs.expect;

describe('user registration', () => {

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
      done();
    });
  });

  it('should not register a user', (done) => {

    req.body = {};

    cm.actions.user.post.register(req, undefined, (status, body) => {

      expect(status).to.equal(400);
      expect(body.errors).to.be.defined;
      done();
    });
  });

  it('should register a user', (done) => {

    cm.actions.user.post.register(req, undefined, (status, body) => {
      cm.User.findOne({ _id: req.body._id }, (err, user) => {

        expect(status).to.equal(200);
        expect(body).to.have.property('user');
        expect(user).to.be.defined;
        expect(user._id.toString()).to.equal(body.user._id.toString());

        done();
      });
    });
  });
});