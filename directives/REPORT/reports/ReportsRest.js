(function() {

	'use strict';

	var ReportsRest = function($rootScope, Restangular, MyDataModel) {

		var reports = Restangular.service('reports');

		reports.reportModel = new MyDataModel({
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
		});

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