/* jshint expr: true */

const cm = require('./../../../server/server');
const expect = cm.libs.expect;

describe('reportEvent address correctness validator', () => {

  let validate, places;

  before((done) => {
    validate = cm.modules.validator.get('ReportEvent', 'address', 'correctness').validator;
    places = require(global.paths.root + '/mockup/setup/hardcoded/places');
    done();
  });

  it('should return false', (done) => {

    let invalidPlace = {
      address: 'some wrong address',
      placeId: '1234',
      lat: 1,
      lng: 1
    };

    validate.call(invalidPlace, invalidPlace.address, (valid) => {
      expect(valid).to.be.false;
      done();
    });
  });

  it('should return true', (done) => {
    validate.call(places[0], places[0].address, (valid) => {
      expect(valid).to.be.true;
      done();
    });
  });
});