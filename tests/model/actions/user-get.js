/* jshint expr: true */

const cm = require('./../../../js/server/server');
const expect = cm.libs.expect;

describe('user get', () => {

  let users, reports;
  let req;

  before((done) => {

    Promise.all([cm.User.remove(), cm.Report.remove()]).then(() => {

      cm.setup.subject = 'User';

      cm.setup.dataFactory.prepare().then((_users) => {
        users = _users;
        cm.setup.subject = 'Report';

        cm.setup.dataFactory.prepare(users).then((_reports) => {
          reports = _reports;

          req = cm.test.helpers.getReqObj();
          req.query.action = 'register';
          req.body = users[0];

          cm.actions.user.post.register(req, undefined, () => {

            req = cm.test.helpers.getReqObj();
            req.decoded._id = users[0]._id;
            req.body = reports[0];

            cm.actions.report.post(req, undefined, () => { done(); });
          });
        });
      });
    });
  });

  beforeEach((done) => {
    req = cm.test.helpers.getReqObj();
    done();
  });

  it('should return 400', (done) => {

    req.decoded._id = users[1]._id;
    req.query._id = users[1]._id;

    cm.actions.user.get(req, undefined, (status) => {
      expect(status).to.equal(400);
      done();
    });
  });

  it('should return 400', (done) => {

    req.query.reportId = reports[1]._id;

    cm.actions.user.get(req, undefined, (status) => {
      expect(status).to.equal(400);
      done();
    });
  });

  it('should return 200', (done) => {

    req.decoded._id = users[0]._id;
    req.query._id = users[0]._id;

    cm.actions.user.get(req, undefined, (status, body) => {
      expect(status).to.equal(200);
      expect(body).to.be.an('array').to.have.lengthOf(1);
      expect(body[0]._id.toString()).to.equal(users[0]._id.toString());
      done();
    });
  });

  it('should return 200', (done) => {

    req.query.reportId = reports[0]._id;

    cm.actions.user.get(req, undefined, (status, body) => {
      expect(status).to.equal(200);
      expect(body).to.be.an('array').to.have.lengthOf(1);
      expect(body[0]._id.toString()).to.equal(users[0]._id.toString());
      done();
    });
  });
});