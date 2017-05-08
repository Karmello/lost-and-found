/* jshint expr: true, loopfunc: true */

var r = require('./../../_requires');

describe('passwordUpdateSpec\n', function() {

	var that;

	beforeEach(function() {
		that = this;
		that.req = r.helpers.getReqObj();
		that.res = new r.Response();
	});



	describe('clearing db', function() {
		it('done', function(done) { r.helpers.clearDb(done); });
	});

	describe('registering', function() {

		it('user should register', function(done) {

			that.req.query.action = 'register';
			Object.assign(that.req.body.model, r.helpers.users.user1);

			r.actions.registerUser(that.req, that.res, function() {

				that.res.should.have.property('code', 201);
				that.userId = that.res.body.user._id;
				done();
			});
		});
	});

	describe('submitting form with proper values', function() {

		it('should successfully update password', function(done) {

			that.req.query.action = 'update_password';
			that.req.params.id = that.userId;
			that.req.decoded._doc._id = that.userId;
			that.req.body.currentPassword = 'password';
			that.req.body.password = 'newpassword';

			r.actions.updatePassword(that.req, that.res, function() {

				that.res.should.have.property('code', 200);
				r.expect(that.res.body.errors).to.be.undefined;
				done();
			});
		});
	});

	describe('logging in with old password', function() {

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

	describe('logging in with new password', function() {

		it('user should log in', function(done) {

			that.req.query.action = 'login';
			Object.assign(that.req.body.model, r.helpers.users.user1);
			that.req.body.model.password = 'newpassword';

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