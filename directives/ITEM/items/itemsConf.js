(function() {

	'use strict';

	var itemsConf = function($rootScope, hardDataService, myClass, itemsService, ItemsRest) {

		var hardData = hardDataService.get();

		this.searchCollectionBrowser = new myClass.MyCollectionBrowser({
			singlePageSize: 10,
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

		this.ownCollectionBrowser = new myClass.MyCollectionBrowser({
			singlePageSize: 10,
			filterer: {
				switchers: [
					{
						_id: 'all',
						label: hardData.phrases[76]
					},
					{
						_id: 'public',
						label: hardData.phrases[77]
					},
					{
						_id: 'private',
						label: hardData.phrases[78]
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

				query.userId = $rootScope.apiData.loggedInUser._id;
				return ItemsRest.getList(query);
			}
		});

		this.anotherUsersCollectionBrowser = new myClass.MyCollectionBrowser({
			singlePageSize: 10,
			filterer: {
				switchers: [
					{
						_id: 'all',
						label: hardData.phrases[76]
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
					_id: 'make_public',
					label: hardData.phrases[69],
					onClick: function() {
						itemsService.makeItemPublic(this.parent.data);
					},
					isHidden: function() {
						if (this.parent.data) {
							return this.parent.data.isPublic;
						}
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