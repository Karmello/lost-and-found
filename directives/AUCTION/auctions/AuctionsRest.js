(function() {

	'use strict';

	var AuctionsRest = function($rootScope, Restangular) {

		var auctions = Restangular.service('auctions');

		Restangular.extendModel('auctions', function(auction) {

			auction._subscribe = function() {

				var copy = Restangular.copy(auction);
				copy.subscribers.push($rootScope.apiData.loggedInUser._id);
				return copy.put();
			};

			auction._unsubscribe = function() {

				var copy = Restangular.copy(auction);
				copy.subscribers.splice(copy.subscribers.indexOf($rootScope.apiData.loggedInUser._id), 1);
				return copy.put();
			};

			auction._placeBid = function() {

				return auction.put(undefined, { action: 'place_bid' });
			};

			auction._isOwn = function() {

				if (auction.item) {
					return auction.item.userId == $rootScope.globalFormModels.personalDetailsModel.getValue('_id');

				} else {
					return $rootScope.apiData.item.userId == $rootScope.globalFormModels.personalDetailsModel.getValue('_id');
				}
			};

			auction._haveSubscribed = function() {

				var userId = $rootScope.globalFormModels.personalDetailsModel.getValue('_id');
				return auction.subscribers.indexOf(userId) > -1;
			};

			return auction;
		});



		return auctions;
	};

	AuctionsRest.$inject = ['$rootScope', 'Restangular'];
	angular.module('appModule').factory('AuctionsRest', AuctionsRest);

})();