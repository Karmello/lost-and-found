/* jshint expr: true */

const cm = require('./../../../js/server/server');
const expect = cm.libs.expect;

describe('report category3 correctness validation', () => {

	let validate;

	beforeEach(() => {
		validate = cm.modules.validator.get('Report', 'avatar', 'correctness').validator;
	});

	it('should return false', () => {

		let report = {

		};

		expect(validate.call(report, report.avatar)).to.be.false;
	});
});