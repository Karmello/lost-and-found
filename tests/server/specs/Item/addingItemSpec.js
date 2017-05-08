/* jshint expr: true, loopfunc: true */

var r = require('./../../_requires');

describe('addingItemSpec\n', function() {

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

	describe('adding item properly', function() {

		it('should return status 201', function(done) {

			Object.assign(that.req.body, r.helpers.items.item1);
			that.req.decoded._doc._id = that.userId;

			r.actions.addItem(that.req, that.res, function() {

				that.res.should.have.property('code', 201);
				done();
			});
		});
	});

	describe('clearing db', function() {
		it('done', function(done) { r.helpers.clearDb(done); });
	});
});