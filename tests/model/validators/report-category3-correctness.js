/* jshint expr: true */

const cm = require('./../../../server/server');
const expect = cm.libs.expect;

describe('report category3 correctness validator', () => {

  let validate, reportCategories;

  before(() => {
    validate = cm.modules.validator.get('Report', 'category3', 'correctness').validator;
    reportCategories = cm.hardData.en.reportCategories;
  });

  it('should return false', () => {

    let report1 = {
      category1: 'wrong',
      category2: reportCategories[1].subcategories[0]._id,
      category3: reportCategories[1].subcategories[0].subcategories[0]._id
    };

    let report2 = {
      category1: reportCategories[1]._id,
      category2: 'wrong',
      category3: reportCategories[1].subcategories[0].subcategories[0]._id
    };

    let report3 = {
      category1: reportCategories[1]._id,
      category2: reportCategories[1].subcategories[0]._id,
      category3: 'wrong'
    };

    expect(validate.call(report1, report1.category3)).to.be.false;
    expect(validate.call(report2, report2.category3)).to.be.false;
    expect(validate.call(report3, report3.category3)).to.be.false;
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