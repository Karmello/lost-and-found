/* jshint expr: true */

const cm = require('./../../../js/server/server');
const expect = cm.libs.expect;

describe('user config validation', () => {

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

	it('should be required', (done) => {

		user.config.language = undefined;
		user.config.theme = undefined;

		user.validate().then(undefined, (err) => {
			expect(Object.keys(err.errors).length).to.equal(2);
			expect(err.errors['config.language'].kind).to.be.equal('required');
			expect(err.errors['config.theme'].kind).to.be.equal('required');
			done();
		});
	});

	it('should be incorrect', (done) => {

		user.config.language = 'notalanguage';
		user.config.theme = 'notatheme';

		user.validate().then(undefined, (err) => {
			expect(Object.keys(err.errors).length).to.equal(2);
			expect(err.errors['config.language'].kind).to.be.equal('incorrect');
			expect(err.errors['config.theme'].kind).to.be.equal('incorrect');
			done();
		});
	});
});