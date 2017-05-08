(function() {

	'use strict';

	var AuctionController = function($rootScope, $scope, ui) {

		// On subscribe click
		$scope.onSubscribeToAnAuctionClick = function() {

			$rootScope.apiData.auction._subscribe();
		};

		// On unsubscribe click
		$scope.onUnsubscribeFromAnAuctionClick = function() {

			$rootScope.apiData.auction._unsubscribe();
		};

		// On show subscribers click
		$scope.onSeeAuctionSubscribersClick = function() {

			$rootScope.$broadcast('auctionSubscribersWindowOpen');
			ui.modals.auctionSubscribersModal.show();
		};
	};

	AuctionController.$inject = ['$rootScope', '$scope', 'ui'];
	angular.module('appModule').controller('AuctionController', AuctionController);

})();