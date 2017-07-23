/* jshint expr: true */

const cm = require('./../../../js/server/server');
const expect = cm.libs.expect;

describe('report avatar correctness validation', () => {

	let validate;

	beforeEach(() => {
		validate = cm.modules.validator.get('Report', 'avatar', 'correctness').validator;
	});

	it('should return false', (done) => {

		let report = { photos: [], avatar: 'photo.png' };

		validate.call(report, report.avatar, (valid) => {
			expect(valid).to.be.false;
			done();
		});
	});

	it('should return false', (done) => {

		let report = {
			photos: [
				{ filename: 'photo1.png', size: 100 },
				{ filename: 'photo2.png', size: 200 }
			]
		};

		validate.call(report, report.avatar, (valid) => {
			expect(valid).to.be.false;
			done();
		});
	});

	it('should return false', (done) => {

		let report = {
			photos: [{ filename: 'photo1.png', size: 100 }],
			avatar: 'photo2.png'
		};

		validate.call(report, report.avatar, (valid) => {
			expect(valid).to.be.false;
			done();
		});
	});

	it('should return true', (done) => {

		let report = { photos: [], avatar: '' };

		validate.call(report, report.avatar, (valid) => {
			expect(valid).to.be.true;
			done();
		});
	});

	it('should return true', (done) => {

		let report = {
			photos: [{ filename: 'photo.png', size: 100 }],
			avatar: 'photo.png'
		};

		validate.call(report, report.avatar, (valid) => {
			expect(valid).to.be.true;
			done();
		});
	});
});