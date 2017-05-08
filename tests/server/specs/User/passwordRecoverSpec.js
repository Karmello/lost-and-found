/* jshint expr: true, loopfunc: true */

var r = require('./../../_requires');

describe('passwordRecoverSpec\n', function() {

	var that;

	beforeEach(function() {
		that = this;
		that.req = r.helpers.getReqObj();
		that.res = new r.Response();
	});



	describe('clearing db', function() {
		it('done', function(done) { r.helpers.clearDb(done); });
	});

	describe('recovering with not registered email', function() {

		it('should return 1 error of type user.email.not_found', function(done) {

			that.req.query.action = 'recover';
			that.req.body.model.email = r.helpers.users.user1.email;

			r.actions.recoverPassword(that.req, that.res, function() {

				that.res.should.have.property('code', 400);
				Object.keys(that.res.body.errors).should.have.lengthOf(1);
				that.res.body.errors.email.properties.should.have.property('type', 'user.email.not_found');
				done();
			});
		});
	});

	describe('recovering with registered email', function() {

		it('should finish successfully', function(done) {

			that.req.query.action = 'register';
			Object.assign(that.req.body.model, r.helpers.users.user1);

			r.actions.registerUser(that.req, that.res, function() {

				that.req.query.action = 'recover';

				r.actions.recoverPassword(that.req, that.res, function() {
					that.res.should.have.property('code', 200);
					done();
				});
			});
		});
	});

	describe('clearing db', function() {
		it('done', function(done) { r.helpers.clearDb(done); });
	});
});