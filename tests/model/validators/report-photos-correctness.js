/* jshint expr: true */

const cm = require('./../../../js/server/server');
const expect = cm.libs.expect;

describe('report photos correctness validator', () => {

  let validate;

  before(() => {
    validate = cm.modules.validator.get('Report', 'photos', 'correctness').validator;
  });

  it('should return false', (done) => {

    let report = {
      photos: [{ filename: 'photo.png' }]
    };

    validate.call(report, report.photos, (valid) => {
      expect(valid).to.be.false;
      done();
    });
  });

  it('should return false', (done) => {

    let photos = [];

    for (let i = 0; i <= cm.Report.config.photos.length.max; i++) {
      photos.push({ filename: 'photo' + (i + 1) + '.png', size: 100 });
    }

    let report = { photos: photos };

    validate.call(report, report.photos, (valid) => {
      expect(valid).to.be.false;
      done();
    });
  });

  it('should return true', (done) => {

    let report = {
      photos: [
        { filename: 'photo1.png', size: 100 },
        { filename: 'photo2.png', size: 200 },
        { filename: 'photo3.png', size: 300 }
      ]
    };

    validate.call(report, report.photos, (valid) => {
      expect(valid).to.be.true;
      done();
    });
  });
});