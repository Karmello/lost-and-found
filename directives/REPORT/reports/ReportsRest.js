(function() {

	'use strict';

	var ReportsRest = function($rootScope, Restangular, MyDataModel) {

		var getReportEventModelConf = function() {
			return {
				group: {},
				date: {},
				placeId: {},
				geolocation: {},
				details: {}
			};
		};

		var getReportModelConf = function() {
			return {
				category1: {},
				category2: {},
				category3: {},
				title: {},
				serialNo: {},
				description: {},
				startEvent: getReportEventModelConf()
			};
		};

		var reports = Restangular.service('reports');

		reports.addReportModel = new MyDataModel(getReportModelConf());
		reports.editReportModel = new MyDataModel(getReportModelConf());
		reports.respondToReportModel = new MyDataModel(getReportEventModelConf());

		reports.reportSearchModel = new MyDataModel({
			title: {},
			category1: {},
			category2: {}
		});

		Restangular.extendModel('reports', function(report) {

			report._isOwn = function() {

				if ($rootScope.apiData.loggedInUser) {
					return this.userId == $rootScope.apiData.loggedInUser._id;
				}
			};

			report.getFullCategory = function() {

				var category1, category2, category3;
				var labels = [];

				if (report.category1) {

					category1 = _.find($rootScope.hardData.reportCategories, function(obj) {
						return obj._id == report.category1;
					});

					labels.push(category1.label);
				}

				if (report.category2) {

					category2 = _.find(category1.subcategories, function(obj) {
						return obj._id == report.category2;
					});

					labels.push(category2.label);
				}

				if (report.category3) {

					category3 = _.find(category2.subcategories, function(obj) {
						return obj._id == report.category3;
					});

					labels.push(category3.label);
				}

				return labels.join(' / ');
			};

			return report;
		});

		return reports;
	};

	ReportsRest.$inject = ['$rootScope', 'Restangular', 'MyDataModel'];
	angular.module('appModule').factory('ReportsRest', ReportsRest);

})();