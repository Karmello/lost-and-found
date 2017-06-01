(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('upgradeForm', function($http, $window, hardDataService, exchangeRateService, PaymentsRest, myClass) {

		var DEFAULT_CURRENCY = 'USD';
		var DEFAULT_AMOUNT = '5.00';
		var CURRENT_YEAR = new Date().getFullYear();

		var upgradeForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/upgradeForm/upgradeForm.html',
			scope: {},
			controller: function($scope) {

				$scope.hardData = hardDataService.get();
				$scope.currentYear = CURRENT_YEAR;

				$scope.myModel = PaymentsRest.paymentModel;

				$scope.myModel.set({
					paymentMethod: 'credit_card',
					currency: DEFAULT_CURRENCY,
					amount: DEFAULT_AMOUNT,
					creditCardExpireMonth: 1,
					creditCardExpireYear: CURRENT_YEAR
				}, true);

				$scope.myForm = new myClass.MyForm({
					ctrlId: 'upgradeForm',
					redirectOnSuccess: true,
					model: $scope.myModel,
					submitAction: function(args) {

						if ($scope.myModel.getValue('paymentMethod') == 'credit_card') {
							return PaymentsRest.post($scope.myModel.getValues());

						} else {

							var body = {
								paymentMethod: $scope.myModel.getValue('paymentMethod'),
								amount: $scope.myModel.getValue('amount'),
								currency: $scope.myModel.getValue('currency')
							};

							return PaymentsRest.post(body);
						}
					},
					submitSuccessCb: function(res) {

						switch ($scope.myModel.getValue('paymentMethod')) {

							case 'credit_card':
								$window.location.reload();
								break;

							case 'paypal':
								$window.open(res.data.url, '_self');
								break;
						}
					},
					submitErrorCb: function(res) {


					}
				});
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					var amounts = {};
					amounts[DEFAULT_CURRENCY] = DEFAULT_AMOUNT;

					angular.forEach(scope.hardData.payment.currencies, function(obj) {
						if (obj.value != DEFAULT_CURRENCY) {
							var amount = exchangeRateService.methods.convert(DEFAULT_AMOUNT, DEFAULT_CURRENCY, obj.value);
							amounts[obj.value] = accounting.unformat(amount);
						}
					});

					scope.$watch('myModel.currency.value.active', function(newCurrency, oldCurrency) {

						if (newCurrency != oldCurrency) {
							scope.myModel.set({ 'amount': amounts[newCurrency] });
						}
					});
				};
			}
		};

		return upgradeForm;
	});

})();