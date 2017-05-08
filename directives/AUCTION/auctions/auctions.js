(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('auctions', function($rootScope, auctionsConf) {

		var auctions = {
			restrict: 'E',
			templateUrl: 'public/directives/AUCTION/auctions/auctions.html',
			scope: {
				ctrlId: '@'
			},
			controller: function($scope) {

				$scope.hardData = $rootScope.hardData;
				$scope.apiData = $rootScope.apiData;

				$scope.init = function() {

					$scope.elemContextMenuConf = auctionsConf.auctionContextMenuConf;

					switch ($scope.ctrlId) {

						case 'UserAuctions':
							$scope.collectionBrowser = auctionsConf.userAuctionsBrowser;
							break;

						case 'ItemAuctions':
							$scope.collectionBrowser = auctionsConf.itemAuctionsBrowser;
							break;
					}

					$scope.collectionBrowser.init();
				};

				if (!$scope.collectionBrowser) { $scope.init(); }
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					if (!$rootScope.$$listeners['init' + scope.ctrlId]) {
						$rootScope.$on('init' + scope.ctrlId, function(e, args) {
							scope.init();
						});
					}

					scope.$on('$destroy', function() {
						$rootScope.$$listeners['init' + scope.ctrlId] = null;
					});
				};
			}
		};

		return auctions;
	});

})();