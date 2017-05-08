(function() {

	'use strict';

	var AppConfigsRest = function(Restangular) {
		return Restangular.service('app_configs');
	};

	AppConfigsRest.$inject = ['Restangular'];
	angular.module('appModule').factory('AppConfigsRest', AppConfigsRest);

})();