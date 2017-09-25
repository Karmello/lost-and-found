/* jshint expr: true */

const cm = require('./../../../js/server/server');
const expect = cm.libs.expect;

describe('report category2 correctness validator', () => {

  let validate, reportCategories;

  before(() => {
    validate = cm.modules.validator.get('Report', 'category2', 'correctness').validator;
    reportCategories = cm.hardData.en.reportCategories;
  });

  it('should return false', () => {

    let report1 = {
      category1: 'wrong',
      category2: reportCategories[0].subcategories[0]._id
    };

    let report2 = {
      category1: reportCategories[0]._id,
      category2: 'wrong'
    };

    expect(validate.call(report1, report1.category2)).to.be.false;
    expect(validate.call(report2, report2.category2)).to.be.false;
  });

  it('should return true', () => {

    let report = {
      category1: reportCategories[0]._id,
      category2: reportCategories[0].subcategories[0]._id
    };

    expect(validate.call(report, report.category2)).to.be.true;
  });
});