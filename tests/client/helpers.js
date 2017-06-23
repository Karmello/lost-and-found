var initApp = function() {

	module('appModule');

	module(function($provide) {

		jasmine.getJSONFixtures().fixturesPath = 'public/json';
		var hardData = getJSONFixture('hardCodedData.json');

		$provide.constant('hardDataConst', hardData);
		$provide.constant('sessionConst', { language: 'en' });
	});
};