(function() {

	'use strict';

	var ReportCategoriesRest = function(Restangular) {
		return Restangular.service('report_categories');
	};

	ReportCategoriesRest.$inject = ['Restangular'];
	angular.module('appModule').factory('ReportCategoriesRest', ReportCategoriesRest);

})();