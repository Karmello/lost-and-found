/* jshint expr: true, loopfunc: true */

var r = require('./../../_requires');

describe('userTokenValidationSpec\n', function() {

	var that;

	beforeEach(function() {
		that = this;
		that.req = r.helpers.getReqObj();
		that.res = new r.Response();
	});



	describe('clearing db', function() {
		it('done', function(done) { r.helpers.clearDb(done); });
	});

	describe('when no token provided', function() {

		it('should return 400 NO_TOKEN_PROVIDED error', function(done) {

			r.modules.authorize.userToken(that.req, that.res, function() {
				that.res.should.have.property('code', 400);
				that.res.should.have.property('body', 'NO_TOKEN_PROVIDED');
				done();
			});
		});
	});

	describe('when bad token provided', function() {

		it('should return 400 TOKEN_AUTHENTICATION_FAILED error', function(done) {

			that.req.body.authToken = 'thisisbadtoken';

			r.modules.authorize.userToken(that.req, that.res, function() {
				that.res.should.have.property('code', 400);
				that.res.should.have.property('body', 'TOKEN_AUTHENTICATION_FAILED');
				done();
			});
		});
	});

	describe('when proper token provided but token\'s user does not exist in db', function() {

		it('should return 400 USER_NOT_FOUND error', function(done) {

			var user = { _id: '111122223333444455556666' };
			that.req.query.authToken = r.jwt.sign({ _doc: user }, process.env.AUTH_SECRET, { expiresIn: global.app.get('AUTH_TOKEN_EXPIRES_IN') });

			r.modules.authorize.userToken(that.req, that.res, function() {
				that.res.should.have.property('code', 400);
				that.res.should.have.property('body', 'USER_NOT_FOUND');
				done();
			});
		});
	});

	describe('registering', function() {

		it('user should register', function(done) {

			that.req.query.action = 'register';
			Object.assign(that.req.body.model, r.helpers.users.user1);

			r.actions.registerUser(that.req, that.res, function() {

				that.user = that.res.body.user;
				that.authToken = that.res.body.authToken;
				that.res.should.have.property('code', 201);
				done();
			});
		});
	});

	describe('when proper token provided after registration', function() {

		it('should return with no errors', function(done) {

			that.req.headers['x-access-token'] = that.authToken;

			r.modules.authorize.userToken(that.req, that.res, function() {
				r.expect(that.res).to.be.empty;
				done();
			});
		});
	});

	describe('clearing db', function() {
		it('done', function(done) { r.helpers.clearDb(done); });
	});
});