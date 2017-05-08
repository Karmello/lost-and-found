/* jshint expr: true, loopfunc: true */

var r = require('./../../_requires');

describe('authenticationSpec\n', function() {

	var that;

	beforeEach(function() {

		that = this;
		that.req = r.helpers.getReqObj();
		that.res = new r.Response();
	});



	describe('clearing db', function() {
		it('done', function(done) { r.helpers.clearDb(done); });
	});

	describe('when logging in without registration', function() {

		it('user should not log in', function(done) {

			that.req.query.action = 'login';
			Object.assign(that.req.body.model, r.helpers.users.user1);

			r.actions.loginUser(that.req, that.res, function() {

				that.res.should.have.property('code', 400);
				Object.keys(that.res.body.errors).should.have.lengthOf(1);
				that.res.body.errors.username.properties.should.have.property('type', 'user.credentials.incorrect');
				done();
			});
		});
	});

	describe('when registering with proper input values', function() {

		it('user and appConfig should be created', function(done) {

			that.req.query.action = 'register';
			Object.assign(that.req.body.model, r.helpers.users.user1);

			r.actions.registerUser(that.req, that.res, function() {

				that.res.should.have.property('code', 201);
				r.expect(that.res.body.errors).to.be.undefined;
				r.expect(that.res.body.user).to.be.defined;
				r.expect(that.res.body.appConfig).to.be.defined;
				r.expect(that.res.body.authToken).to.be.defined;

				r.User.findOne({ _id: that.res.body.user._id }, function(err, user) {
					r.AppConfig.findOne({ userId: that.res.body.user._id }, function(err, appConfig) {

						r.expect(user).to.be.defined;
						r.expect(appConfig).to.be.defined;
						done();
					});
				});
			});
		});
	});

	describe('when logging in after registration', function() {

		it('user should log in', function(done) {

			that.req.query.action = 'login';
			Object.assign(that.req.body.model, r.helpers.users.user1);

			r.actions.loginUser(that.req, that.res, function() {

				that.res.should.have.property('code', 200);
				r.expect(that.res.body.errors).to.be.undefined;
				r.expect(that.res.body.user).to.be.defined;
				r.expect(that.res.body.appConfig).to.be.defined;
				r.expect(that.res.body.authToken).to.be.defined;
				done();
			});
		});
	});

	describe('clearing db', function() {
		it('done', function(done) { r.helpers.clearDb(done); });
	});
});