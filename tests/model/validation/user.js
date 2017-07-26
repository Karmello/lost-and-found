/* jshint expr: true */

const cm = require('./../../../js/server/server');
const expect = cm.libs.expect;

describe('user validation', () => {

	let data, user;

	before((done) => {

		cm.setup.subject = 'User';

		cm.setup.dataFactory.prepare().then((_data) => {
			data = _data;
			done();
		});
	});

	beforeEach((done) => {
		cm.User.remove(() => {
			user = new cm.User(data[0]);
			done();
		});
	});

	it('should be valid', (done) => {

		user.validate().then((err) => {
			expect(err).to.be.undefined;
			done();
		});
	});
});