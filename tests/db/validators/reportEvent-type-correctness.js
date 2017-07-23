/* jshint expr: true */

const cm = require('./../../../js/server/server');
const expect = cm.libs.expect;

describe('reportEvent type correctness validation', () => {

	let validate, reportTypes;

	beforeEach(() => {
		validate = cm.modules.validator.get('ReportEvent', 'type', 'correctness').validator;
		reportTypes = cm.hardData.en.reportTypes;
	});

	it('should return false', () => {
		expect(validate('unknown')).to.be.false;
	});

	it('should return true', () => {
		expect(validate(reportTypes[0].value)).to.be.true;
	});
});