/* jshint expr: true */

const cm = require('./../../../js/server/server');
const expect = cm.libs.expect;

describe('user first and last name validation', () => {

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

		user.firstname = undefined;
		user.lastname = undefined;

		user.validate().then(undefined, (err) => {
			expect(Object.keys(err.errors).length).to.equal(2);
			expect(err.errors.firstname.kind).to.be.equal('required');
			expect(err.errors.lastname.kind).to.be.equal('required');
			done();
		});
	});

	it('should contain special chars', (done) => {

		user.firstname = 'Firstname*';
		user.lastname = 'Last%name';

		user.validate().then(undefined, (err) => {
			expect(Object.keys(err.errors).length).to.equal(2);
			expect(err.errors.firstname.kind).to.be.equal('special_chars_found');
			expect(err.errors.lastname.kind).to.be.equal('special_chars_found');
			done();
		});
	});

	it('should contain digits', (done) => {

		user.firstname = 'Firstname100';
		user.lastname = 'Last456name';

		user.validate().then(undefined, (err) => {
			expect(Object.keys(err.errors).length).to.equal(2);
			expect(err.errors.firstname.kind).to.be.equal('digits_found');
			expect(err.errors.lastname.kind).to.be.equal('digits_found');
			done();
		});
	});

	it('should have wrong length', (done) => {

		user.firstname = '';
		user.lastname = '';

		for (let i = 0; i < cm.User.config.firstname.length.max + 1; i++) { user.firstname += 'a'; }
		for (let i = 0; i < cm.User.config.lastname.length.max + 1; i++) { user.lastname += 'a'; }

		user.validate().then(undefined, (err) => {
			expect(Object.keys(err.errors).length).to.equal(2);
			expect(err.errors.firstname.kind).to.be.equal('wrong_length');
			expect(err.errors.lastname.kind).to.be.equal('wrong_length');
			done();
		});
	});
});