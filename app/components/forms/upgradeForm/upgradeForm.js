angular.module('appModule').directive('upgradeForm', function($http, $window, hardDataService, exchangeRateService, PaymentsRest, MyForm) {

  var DEFAULT_CURRENCY = 'USD';
  var DEFAULT_AMOUNT = '5.00';
  var CURRENT_YEAR = new Date().getFullYear();

  return {
    restrict: 'E',
    templateUrl: 'public/templates/upgradeForm.html',
    scope: {},
    controller: function($scope) {

      $scope.hardData = hardDataService.get();
      $scope.currentYear = CURRENT_YEAR;

      $scope.myModel = PaymentsRest.paymentModel;

      $scope.myModel.set({
        method: 'paypal',
        currency: DEFAULT_CURRENCY,
        amount: DEFAULT_AMOUNT,
        creditCardExpireMonth: 1,
        creditCardExpireYear: CURRENT_YEAR
      }, true);

      $scope.myForm = new MyForm({
        model: $scope.myModel,
        onSubmit: function(args) {

          if ($scope.myModel.getValue('method') == 'credit_card') {
            return PaymentsRest.post($scope.myModel.getValues());

          } else {

            var body = {
              method: $scope.myModel.getValue('method'),
              amount: $scope.myModel.getValue('amount'),
              currency: $scope.myModel.getValue('currency')
            };

            return PaymentsRest.post(body);
          }
        },
        onSubmitSuccess: function(res) {

          switch ($scope.myModel.getValue('method')) {

            case 'credit_card':
              $window.location.reload();
              break;

            case 'paypal':
              $window.open(res.data.url, '_self');
              break;
          }
        },
        onSubmitError: function(res) {


        }
      }, $scope);
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
});