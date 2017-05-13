(function() {

	'use strict';

	var ReportsRest = function($rootScope, $stateParams, Restangular, storageService) {

		var reports = Restangular.service('reports');

		Restangular.extendModel('reports', function(report) {

			report._isOwn = function() {

				return this.userId == $rootScope.globalFormModels.personalDetailsModel.getValue('_id');
			};

			return report;
		});



		return reports;
	};

	ReportsRest.$inject = ['$rootScope', '$stateParams', 'Restangular', 'storageService'];
	angular.module('appModule').factory('ReportsRest', ReportsRest);

})();