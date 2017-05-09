(function() {

	'use strict';

	var itemsConf = function($rootScope, hardDataService, myClass, itemsService, ItemsRest) {

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
						label: hardData.itemTypes[0].label
					},
					{
						_id: 'F',
						label: hardData.itemTypes[1].label
					}
				]
			},
			sorter: {
				switchers: [
					{
						_id: 'title',
						label: hardData.phrases[84]
					},
					{
						_id: 'dateAdded',
						label: hardData.phrases[137]
					}
				]
			},
			fetchData: function(query) {

				var model = $rootScope.globalFormModels.itemSearchModel.getValues();

				query.title = model.title;
				query.categoryId = model.categoryId;
				query.subcategoryId = model.subcategoryId;

				return ItemsRest.getList(query);
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
						label: hardData.itemTypes[0].label
					},
					{
						_id: 'F',
						label: hardData.itemTypes[1].label
					}
				]
			},
			sorter: {
				switchers: [
					{
						_id: 'title',
						label: hardData.phrases[84]
					},
					{
						_id: 'dateAdded',
						label: hardData.phrases[137]
					}
				]
			},
			fetchData: function(query) {

				query.userId = $rootScope.apiData.profileUser._id;
				return ItemsRest.getList(query);
			}
		});

		this.itemContextMenuConf = {
			icon: 'glyphicon glyphicon-option-horizontal',
			switchers: [
				{
					_id: 'edit',
					label: hardData.phrases[68],
					onClick: function() {
						$rootScope.$broadcast('displayEditItemWindow', { item: this.parent.data });
					}
				},
				{
					_id: 'delete',
					label: hardData.phrases[14],
					onClick: function() {
						itemsService.deleteItems([this.parent.data]);
					}
				}
			]
		};

		return this;
	};



	itemsConf.$inject = ['$rootScope', 'hardDataService', 'myClass', 'itemsService', 'ItemsRest'];
	angular.module('appModule').service('itemsConf', itemsConf);

})();