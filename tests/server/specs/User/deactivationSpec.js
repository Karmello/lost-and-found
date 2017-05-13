/* jshint expr: true, loopfunc: true */

var r = require('./../../_requires');

describe('deactivationSpec\n', function() {

	var that;

	beforeEach(function() {
		that = this;
		that.req = r.helpers.getReqObj();
		that.res = new r.Response();
	});



	describe('clearing db', function() {
		it('done', function(done) { r.helpers.clearDb(done); });
	});

	describe('deactivating not existing account', function() {

		it('should return 400 USER_NOT_FOUND error', function(done) {

			that.req.decoded._doc._id = '111122223333444455556666';
			that.req.params.id = '111122223333444455556666';

			r.actions.deactivateAccount(that.req, that.res, function() {

				that.res.should.have.property('code', 400);
				r.expect(that.res.body).to.equal('USER_NOT_FOUND');
				done();
			});
		});
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

	describe('legal deactivation', function() {

		it('should delete user, appConfig and all user\'s reports', function(done) {

			that.req.decoded._doc._id = that.userId;
			that.req.params.id = that.userId;

			r.actions.deactivateAccount(that.req, that.res, function() {

				that.res.should.have.property('code', 200);

				r.User.findOne({ _id: that.userId }, function(err, user) {
					r.Report.find({ userId: that.userId }, function(err, reports) {
						r.AppConfig.findOne({ userId: that.userId }, function(err, appConfig) {

							r.expect(user).to.be.null;
							r.expect(appConfig).to.be.null;
							r.expect(reports).to.have.lengthOf(0);
							done();
						});
					});
				});
			});
		});
	});

	describe('clearing db', function() {
		it('done', function(done) { r.helpers.clearDb(done); });
	});
});