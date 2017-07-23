/* jshint expr: true */

const cm = require('./../../../js/server/server');
const expect = cm.libs.expect;

describe('user username uniqueness validation', () => {

	let validate, users;

	beforeEach((done) => {

		cm.setup.subject = 'User';
		validate = cm.modules.validator.get('User', 'username', 'uniqueness').validator;

		cm.User.remove(() => {
			cm.setup.dataFactory.prepare().then((_users) => {
				users = _users;
				done();
			});
		});
	});

	it('should return true', (done) => {
		validate(users[0].username, (valid) => {
			expect(valid).to.be.true;
			done();
		});
	});

	it('should return false', (done) => {

		let newUser = new cm.User(users[0]);

		newUser.save((err) => {
			validate(newUser.username, (valid) => {
				expect(valid).to.be.false;
				done();
			});
		});
	});
});