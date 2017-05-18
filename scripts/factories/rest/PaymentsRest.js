(function() {

	'use strict';

	var PaymentsRest = function(Restangular) {
		return Restangular.service('payments');
	};

	PaymentsRest.$inject = ['Restangular'];
	angular.module('appModule').factory('PaymentsRest', PaymentsRest);

})();