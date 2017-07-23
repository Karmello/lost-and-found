/* jshint expr: true */

const cm = require('./../../../js/server/server');
const expect = cm.libs.expect;

describe('report category3 correctness validation', () => {

	let validate, reportCategories;

	beforeEach(() => {
		validate = cm.modules.validator.get('Report', 'category3', 'correctness').validator;
		reportCategories = cm.hardData.en.reportCategories;
	});

	it('should return false', () => {

		let report = {
			category1: 'wrong',
			category2: reportCategories[1].subcategories[0]._id,
			category3: reportCategories[1].subcategories[0].subcategories[0]._id
		};

		expect(validate.call(report, report.category3)).to.be.false;
	});

	it('should return false', () => {

		let report = {
			category1: reportCategories[1]._id,
			category2: 'wrong',
			category3: reportCategories[1].subcategories[0].subcategories[0]._id
		};

		expect(validate.call(report, report.category3)).to.be.false;
	});

	it('should return false', () => {

		let report = {
			category1: reportCategories[1]._id,
			category2: reportCategories[1].subcategories[0]._id,
			category3: 'wrong'
		};

		expect(validate.call(report, report.category3)).to.be.false;
	});

	it('should return true', () => {

		let report = {
			category1: reportCategories[1]._id,
			category2: reportCategories[1].subcategories[0]._id,
			category3: reportCategories[1].subcategories[0].subcategories[0]._id
		};

		expect(validate.call(report, report.category3)).to.be.true;
	});
});