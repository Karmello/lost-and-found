(function() {

	'use strict';

	var ReportTypesRest = function(Restangular, storageService) {

		var reportTypes = Restangular.service('report_types');
		return reportTypes;
	};

	ReportTypesRest.$inject = ['Restangular', 'storageService'];
	angular.module('appModule').factory('ReportTypesRest', ReportTypesRest);

})();