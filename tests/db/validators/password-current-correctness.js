/* jshint expr: true */

const cm = require('./../../../js/server/server');
const expect = cm.libs.expect;

describe('password current correctness validation', () => {

	let validate, users;

	beforeEach((done) => {

		validate = cm.modules.validator.get('Password', 'current', 'correctness').validator;
		cm.setup.subject = 'User';

		cm.User.remove(() => {
			cm.setup.dataFactory.prepare().then((_users) => {
				users = _users;
				new cm.User(users[0]).save(() => { done(); });
			});
		});
	});

	it('should return false', (done) => {

		let password = {
			userId: users[0]._id,
			current: 'wrong_password'
		};

		validate.call(password, password.current, (valid) => {
			expect(valid).to.be.false;
			done();
		});
	});

	it('should return true', (done) => {

		let password = {
			userId: users[0]._id,
			current: users[0].password
		};

		validate.call(password, password.current, (valid) => {
			expect(valid).to.be.true;
			done();
		});
	});
});