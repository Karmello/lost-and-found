/* eslint no-unused-vars: 0 */

const setupAngularModule = () => {

  module('appModule');

  jasmine.getJSONFixtures().fixturesPath = 'base/public/json';

  module(function($provide) {
    $provide.constant('hardDataConst', window.getJSONFixture('hardCodedData.json'));
    $provide.constant('sessionConst', window.getFreshSession());
  });
};