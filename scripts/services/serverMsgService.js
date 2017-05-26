(function() {

	'use strict';

	var serverMsgService = function(hardDataService) {

		var service = {};
		var hardData = hardDataService.get();

		service.getValidationErrMsg = function(error) {

			if (typeof hardData.validation[error.kind] == 'string') {
				return hardData.validation[error.kind];

			} else if (Array.isArray(hardData.validation[error.kind])) {

				var limits = error.properties.limits;

				if (limits) {

					if (limits.min && limits.max) {
						return hardData.validation[error.kind][1] + ' ' + limits.min + '-' + limits.max;

					} else {
						return hardData.validation[error.kind][0] + ' ' + limits.max;
					}
				}
			}
		};

		return service;
	};

	serverMsgService.$inject = ['hardDataService'];
	angular.module('appModule').service('serverMsgService', serverMsgService);

})();