(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('auctionWindow', function($rootScope, ui, myClass, AuctionsRest) {

		var auctionWindow = {
			restrict: 'E',
			templateUrl: 'public/directives/AUCTION/auctionWindow/auctionWindow.html',
			scope: {},
			controller: function($scope) {

				$scope.currencies = $rootScope.hardData.currencies;

				$scope.myModal = new myClass.MyModal({ id: 'auctionModal', title: $rootScope.hardData.phrases[120] });
				$scope.myModel = new myClass.MyFormModel('auctionModel', ['itemId', 'currency', 'initialValue', 'bidIncrement', 'minSellPrice', 'amount'], true);

				$scope.myForm = new myClass.MyForm({
					ctrlId: 'auctionForm',
					model: $scope.myModel,
					submitAction: function(args) {

						$scope.myModel.setValue('itemId', $rootScope.apiData.item._id);
						return AuctionsRest.post($scope.myModel.getValues());
					},
					submitSuccessCb: function(res) {

						$scope.myModal.hide(function() {
							$rootScope.$broadcast('initItemAuctions');
						});
					}
				});
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					$rootScope.$on('displayAddAuctionWindow', function(e, args) {
						scope.myModel.set({});
						scope.myModel.clearErrors();
						scope.myModal.show();
					});
				};
			}
		};

		return auctionWindow;
	});

})();