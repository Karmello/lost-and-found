(function() {

	'use strict';

	var $q = angular.injector(['ng']).get('$q');
	var $http = angular.injector(['ng']).get('$http');

	var appModule = angular.module('appModule', [
		'ui.bootstrap',
		'ui.router',
		'ngAnimate',
		'restangular',
		'LocalStorageModule',
		'angular-momentjs'
	]);

	$q.all([

		$http.get('public/json/hard_coded/hard_coded_en.json'),
		$http.get('public/json/hard_coded/hard_coded_pl.json'),
		$http.get('/session')

	]).then(function(res) {

		appModule.constant('hardDataConst', { en: res[0].data, pl: res[1].data });
		appModule.constant('sessionConst', res[2].data);
		angular.element(document).ready(function() { angular.bootstrap(document, ['appModule']); });
	});

})();