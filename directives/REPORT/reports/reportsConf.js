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
						label: hardData.phrases[76]
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
						_id: 'dateAdded',
						label: hardData.phrases[137]
					},
					{
						_id: 'title',
						label: hardData.phrases[84]
					},
					{
						_id: 'date',
						label: hardData.phrases[146]
					}
				]
			},
			fetchData: function(query) {

				var model = $rootScope.globalFormModels.reportSearchModel.getValues();

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
						label: hardData.phrases[76]
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
						_id: 'dateAdded',
						label: hardData.phrases[137]
					},
					{
						_id: 'title',
						label: hardData.phrases[84]
					},
					{
						_id: 'date',
						label: hardData.phrases[146]
					}
				]
			},
			fetchData: function(query) {

				query.userId = $rootScope.apiData.profileUser._id;
				return ReportsRest.getList(query);
			}
		});

		return this;
	};



	reportsConf.$inject = ['$rootScope', 'hardDataService', 'myClass', 'ReportsRest'];
	angular.module('appModule').service('reportsConf', reportsConf);

})();