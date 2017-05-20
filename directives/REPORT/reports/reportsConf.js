(function() {

	'use strict';

	var reportsConf = function($rootScope, hardDataService, myClass, ReportsRest) {

		var hardData = hardDataService.get();

		this.searchCollectionBrowser = new myClass.MyCollectionBrowser({
			singlePageSize: 25,
			filterer: {
				switchers: [
					{
						_id: 'all',
						label: hardData.status[1]
					},
					{
						_id: 'L',
						label: hardData.reportGroups[0].label
					},
					{
						_id: 'F',
						label: hardData.reportGroups[1].label
					}
				]
			},
			sorter: {
				switchers: [
					{
						_id: 'title',
						label: hardData.status[7]
					},
					{
						_id: 'date',
						label: hardData.status[8]
					}
				]
			},
			fetchData: function(query) {

				var model = $rootScope.globalFormModels.reportSearchModel.getValues();

				query.subject = 'reports';
				query.title = model.title;
				query.categoryId = model.categoryId;
				query.subcategoryId = model.subcategoryId;

				return ReportsRest.getList(query);
			}
		});

		this.profileCollectionBrowser = new myClass.MyCollectionBrowser({
			singlePageSize: 25,
			filterer: {
				switchers: [
					{
						_id: 'all',
						label: hardData.status[1]
					},
					{
						_id: 'L',
						label: hardData.reportGroups[0].label
					},
					{
						_id: 'F',
						label: hardData.reportGroups[1].label
					}
				]
			},
			sorter: {
				switchers: [
					{
						_id: 'title',
						label: hardData.status[7]
					},
					{
						_id: 'date',
						label: hardData.status[8]
					}
				]
			},
			fetchData: function(query) {

				query.subject = 'user_reports';
				query.userId = $rootScope.apiData.profileUser._id;
				return ReportsRest.getList(query);
			}
		});

		this.recentlyReportedCollectionBrowser = new myClass.MyCollectionBrowser({
			singlePageSize: 5,
			noPager: true,
			fetchData: function(query) {

				query.subject = 'new_reports';
				query.sort='-dateAdded';
				query.limit = 5;

				return ReportsRest.getList(query);
			}
		});

		this.recentlyViewedCollectionBrowser = new myClass.MyCollectionBrowser({
			singlePageSize: 5,
			fetchData: function(query) {

				query.subject = 'recently_viewed_reports';
				query.limit = 5;

				return ReportsRest.getList(query);
			}
		});

		return this;
	};



	reportsConf.$inject = ['$rootScope', 'hardDataService', 'myClass', 'ReportsRest'];
	angular.module('appModule').service('reportsConf', reportsConf);

})();