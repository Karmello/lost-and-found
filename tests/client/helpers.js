var initApp = function() {

	module('appModule');

	module(function($provide) {

		jasmine.getJSONFixtures().fixturesPath = 'public/json/hard_coded';
		var hardData = getJSONFixture('hard_coded_en.json');

		$provide.constant('hardDataConst', { en: hardData });
		$provide.constant('sessionConst', { language: 'en' });
	});
};