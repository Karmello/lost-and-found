(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('auctionNumBox', function($rootScope, $sce, exchangeRateService) {

		var auctionNumBox = {
			restrict: 'E',
			templateUrl: 'public/directives/AUCTION/auctionNumBox/auctionNumBox.html',
			scope: {
				auction: '=auction'
			},
			controller: function($scope) {

				$scope.hardData = $rootScope.hardData;
				$scope.exchangeRateService = exchangeRateService;

				$scope.numValues = [
					{ name: 'initialValue', message: '' },
					{ name: 'bidIncrement', message: '' },
					{ name: 'minSellPrice', message: '' }
				];
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					scope.$watch(function() { return scope.auction; }, function(auction) {

						if (auction) {

							var rates = exchangeRateService.config.availableRates;

							for (var i in scope.numValues) {

								var message = '';

								for (var rateKey in rates) {
									if (rateKey != scope.auction.currency) {
										var value = exchangeRateService.methods.convert(scope.auction[scope.numValues[i].name], scope.auction.currency, rateKey);
										message += value + '<br />';
									}
								}

								scope.numValues[i].message = $sce.trustAsHtml(message);
							}
						}
					});
				};
			}
		};

		return auctionNumBox;
	});

})();