/* jshint expr: true */

const cm = require('./../../../js/server/server');
const expect = cm.libs.expect;

describe('report category1 correctness validator', () => {

	let validate, reportCategories;

	before(() => {
		validate = cm.modules.validator.get('Report', 'category1', 'correctness').validator;
		reportCategories = cm.hardData.en.reportCategories;
	});

	it('should return false', () => {
		expect(validate()).to.be.false;
	});

	it('should return true', () => {
		expect(validate(reportCategories[0]._id)).to.be.true;
		expect(validate(reportCategories[1]._id)).to.be.true;
	});
});