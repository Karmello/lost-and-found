(function() {

	'use strict';

	var auctionsConf = function($rootScope, $state, auctionsService, hardDataService, myClass, AuctionsRest) {

		var hardData = hardDataService.get();

		this.userAuctionsBrowser = new myClass.MyCollectionBrowser({
			singlePageSize: 3,
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
						_id: 'dateAdded',
						label: hardData.phrases[137]
					},
					{
						_id: 'currency',
						label: hardData.phrases[102]
					},
					{
						_id: 'initialValue',
						label: hardData.phrases[85]
					},
					{
						_id: 'bidIncrement',
						label: hardData.phrases[99]
					},
					{
						_id: 'minSellPrice',
						label: hardData.phrases[100]
					},
					{
						_id: 'amount',
						label: hardData.phrases[104]
					}
				]
			},
			fetchData: function(query) {

				query.userId = $rootScope.apiData.profileUser._id;
				return AuctionsRest.getList(query);
			}
		});

		this.itemAuctionsBrowser = new myClass.MyCollectionBrowser({
			singlePageSize: 3,
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
						_id: 'dateAdded',
						label: hardData.phrases[137]
					},
					{
						_id: 'currency',
						label: hardData.phrases[102]
					},
					{
						_id: 'initialValue',
						label: hardData.phrases[85]
					},
					{
						_id: 'bidIncrement',
						label: hardData.phrases[99]
					},
					{
						_id: 'minSellPrice',
						label: hardData.phrases[100]
					},
					{
						_id: 'amount',
						label: hardData.phrases[104]
					}
				]
			},
			fetchData: function(query) {

				query.itemId = $rootScope.apiData.item._id;
				return AuctionsRest.getList(query);
			}
		});



		var onSubscribeStatusChange = function(that) {

			that.parent.data['_' + that._id]().then(function() {

				switch ($state.current.name) {

					case 'main.user':
						$rootScope.$broadcast('initUserAuctions');
						break;

					case 'main.item':
						$rootScope.$broadcast('initItemAuctions');
						break;
				}
			});
		};

		this.auctionContextMenuConf = {
			icon: 'glyphicon glyphicon-option-horizontal',
			switchers: [
				{
					_id: 'delete',
					label: hardData.phrases[14],
					onClick: function() {
						auctionsService.deleteAuctions([this.parent.data]);
					},
					isHidden: function() {
						return !this.parent.data._isOwn();
					}
				},
				{
					_id: 'subscribe',
					label: hardData.phrases[101],
					onClick: function() {
						onSubscribeStatusChange(this);
					},
					isHidden: function() {
						return this.parent.data._isOwn() || this.parent.data._haveSubscribed();
					}
				},
				{
					_id: 'unsubscribe',
					label: hardData.phrases[105],
					onClick: function() {
						onSubscribeStatusChange(this);
					},
					isHidden: function() {
						return this.parent.data._isOwn() || !this.parent.data._haveSubscribed();
					}
				}
			]
		};

		return this;
	};



	auctionsConf.$inject = ['$rootScope', '$state', 'auctionsService', 'hardDataService', 'myClass', 'AuctionsRest'];
	angular.module('appModule').service('auctionsConf', auctionsConf);

})();