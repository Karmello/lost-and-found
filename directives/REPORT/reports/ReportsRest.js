(function() {

	'use strict';

	var ReportsRest = function($rootScope, $stateParams, Restangular, storageService, MyDataModel) {

		var reports = Restangular.service('reports');

		reports.myDataModel = {
			categoryId: {},
			subcategoryId: {},
			subsubcategoryId: {},
			title: {},
			serialNo: {},
			description: {},
			startEvent: {
				group: {},
				date: {},
				geolocation: {},
				details: {}
			}
		};

		Restangular.extendModel('reports', function(report) {

			report._isOwn = function() {
				return this.userId == $rootScope.globalFormModels.personalDetailsModel.getValue('_id');
			};

			return report;
		});

		return reports;
	};

	ReportsRest.$inject = ['$rootScope', '$stateParams', 'Restangular', 'storageService', 'MyDataModel'];
	angular.module('appModule').factory('ReportsRest', ReportsRest);

})();