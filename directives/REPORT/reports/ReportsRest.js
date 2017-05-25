(function() {

	'use strict';

	var ReportsRest = function($rootScope, Restangular, MyDataModel) {

		var getReportModelConf = function() {
			return {
				categoryId: {},
				subcategoryId: {},
				subsubcategoryId: {},
				title: {},
				serialNo: {},
				description: {},
				startEvent: {
					group: {},
					date: {},
					placeId: {},
					geolocation: {},
					details: {}
				}
			};
		};

		var reports = Restangular.service('reports');

		reports.newReportModel = new MyDataModel(getReportModelConf());
		reports.editReportModel = new MyDataModel(getReportModelConf());

		reports.reportSearchModel = new MyDataModel({
			title: {},
			categoryId: {},
			subcategoryId: {}
		});

		Restangular.extendModel('reports', function(report) {

			report._isOwn = function() {
				return this.userId == $rootScope.apiData.loggedInUser._id;
			};

			return report;
		});

		return reports;
	};

	ReportsRest.$inject = ['$rootScope', 'Restangular', 'MyDataModel'];
	angular.module('appModule').factory('ReportsRest', ReportsRest);

})();