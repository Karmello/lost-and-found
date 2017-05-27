/* jshint expr: true, loopfunc: true */

var r = require('./../../_requires');

describe('userDetailsUpdateSpec\n', function() {

	var that;

	beforeEach(function() {
		that = this;
		that.req = r.helpers.getReqObj();
		that.res = new r.Response();
	});



	describe('clearing db', function() {
		it('done', function(done) { r.helpers.clearDb(done); });
	});

	describe('registering first user', function() {

		it('user should register', function(done) {

			that.req.query.action = 'register';
			Object.assign(that.req.body.model, r.helpers.users.user1);

			r.actions.registerUser(that.req, that.res, function() {

				that.res.should.have.property('code', 201);
				that.user1Id = that.res.body.user._id;
				done();
			});
		});
	});

	describe('registering second user', function() {

		it('user should register', function(done) {

			that.req.query.action = 'register';
			Object.assign(that.req.body.model, r.helpers.users.user2);

			r.actions.registerUser(that.req, that.res, function() {

				that.res.should.have.property('code', 201);
				that.user2Id = that.res.body.user._id;
				done();
			});
		});
	});

	describe('updating user1 details without any changes', function() {

		it('should update with no errors', function(done) {

			that.req.query.action = 'update_details';

			that.req.decoded._id = that.user1Id;
			that.req.decoded.email = r.helpers.users.user1.email;

			that.req.body._id = that.user1Id;
			that.req.body.email = r.helpers.users.user1.email;
			that.req.body.firstname = r.helpers.users.user1.firstname;
			that.req.body.lastname = r.helpers.users.user1.lastname;
			that.req.body.country = r.helpers.users.user1.country;

			r.actions.updateUserDetails(that.req, that.res, function() {

				that.res.should.have.property('code', 200);
				done();
			});
		});
	});

	describe('updating user1 details using user2 email', function() {

		it('should return 400 user.email.not_unique error', function(done) {

			that.req.query.action = 'update_details';

			that.req.decoded._id = that.user1Id;
			that.req.decoded.email = r.helpers.users.user1.email;

			that.req.body._id = that.user1Id;
			that.req.body.email = r.helpers.users.user2.email;
			that.req.body.firstname = r.helpers.users.user1.firstname;
			that.req.body.lastname = r.helpers.users.user1.lastname;
			that.req.body.country = r.helpers.users.user1.country;

			r.actions.updateUserDetails(that.req, that.res, function() {

				that.res.should.have.property('code', 400);
				Object.keys(that.res.body.errors).should.have.lengthOf(1);
				that.res.body.errors.email.properties.should.have.property('type', 'user.email.not_unique');
				done();
			});
		});
	});

	describe('clearing db', function() {
		it('done', function(done) { r.helpers.clearDb(done); });
	});
});