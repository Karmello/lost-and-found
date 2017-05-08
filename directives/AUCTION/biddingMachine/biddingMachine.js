(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('biddingMachine', function($rootScope, auctionsService) {

		var socket;

		var biddingMachine = {
			restrict: 'E',
			templateUrl: 'public/directives/AUCTION/biddingMachine/biddingMachine.html',
			scope: {
				item: '='
			},
			controller: function($scope) {

				$scope.onIncreaseBtnClick = function() {

					$scope.bid += $scope.item.bidIncrement;
				};

				$scope.onDecreaseBtnClick = function() {

					if ($scope.bid > $scope.item.initialValue) {
						$scope.bid -= $scope.item.bidIncrement;
					}
				};

				$scope.onPlaceBidBtnClick = function() {


				};
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					socket = $rootScope.socket;

					scope.$watch(function() { return scope.item; }, function(item) {

						if (item) {
							scope.bid = scope.item.initialValue;
						}
					});
				};
			}
		};

		return biddingMachine;
	});

})();