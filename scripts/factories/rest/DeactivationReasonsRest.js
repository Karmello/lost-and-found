(function() {

	'use strict';

	var DeactivationReasonsRest = function(Restangular, MyDataModel) {

		var deactivationReasons = Restangular.service('deactivation_reasons')

		deactivationReasons.deactivationReasonModel = new MyDataModel({
			deactivationReasonId: {}
		});

		return deactivationReasons;
	};

	DeactivationReasonsRest.$inject = ['Restangular', 'MyDataModel'];
	angular.module('appModule').factory('DeactivationReasonsRest', DeactivationReasonsRest);

})();