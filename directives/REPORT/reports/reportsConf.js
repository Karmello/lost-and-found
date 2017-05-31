(function() {

	'use strict';

	var reportsConf = function($rootScope, hardDataService, myClass, ReportsRest) {

		var hardData = hardDataService.get();

		this.searchReports = new myClass.MyCollectionBrowser({
			singlePageSize: 25,
			filterer: {
				switchers: [
					{
						_id: 'all',
						label: hardData.status[1]
					},
					{
						_id: 'lost',
						label: hardData.reportGroups[0].label2
					},
					{
						_id: 'found',
						label: hardData.reportGroups[1].label2
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

				var model = ReportsRest.reportSearchModel.getValues();

				query.subject = 'searchReports';
				query.title = model.title;
				query.category1 = model.category1;
				query.category2 = model.category2;

				return ReportsRest.getList(query);
			}
		});

		this.userReports = new myClass.MyCollectionBrowser({
			singlePageSize: 25,
			filterer: {
				switchers: [
					{
						_id: 'all',
						label: hardData.status[1]
					},
					{
						_id: 'lost',
						label: hardData.reportGroups[0].label2
					},
					{
						_id: 'found',
						label: hardData.reportGroups[1].label2
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

				query.subject = 'userReports';
				query.userId = $rootScope.apiData.profileUser._id;
				return ReportsRest.getList(query);
			}
		});

		this.recentReports = new myClass.MyCollectionBrowser({
			singlePageSize: 5,
			noPager: true,
			fetchData: function(query) {

				query.subject = 'recentReports';
				query.sort='-dateAdded';
				query.limit = 5;

				return ReportsRest.getList(query);
			}
		});

		this.viewedReports = new myClass.MyCollectionBrowser({
			singlePageSize: 5,
			hideRefresher: true,
			fetchData: function(query) {

				query.subject = 'viewedReports';
				query.limit = 5;

				return ReportsRest.getList(query);
			}
		});

		return this;
	};

	reportsConf.$inject = ['$rootScope', 'hardDataService', 'myClass', 'ReportsRest'];
	angular.module('appModule').service('reportsConf', reportsConf);

})();