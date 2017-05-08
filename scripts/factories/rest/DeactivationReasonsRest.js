(function() {

	'use strict';

	var DeactivationReasonsRest = function(Restangular) {
		return Restangular.service('deactivation_reasons');
	};

	DeactivationReasonsRest.$inject = ['Restangular'];
	angular.module('appModule').factory('DeactivationReasonsRest', DeactivationReasonsRest);

})();