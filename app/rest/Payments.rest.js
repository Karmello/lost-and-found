var PaymentsRest = function(Restangular, MyFormModel) {

  var payments = Restangular.service('payments');

  payments.paymentModel = new MyFormModel({
    method: {},
    amount: {},
    currency: {},
    creditCard: {
      type: {},
      number: {},
      expireMonth: {},
      expireYear: {},
      cvv2: {},
      name: {
        firstname: {},
        lastname: {}
      }
    }
  });

  return payments;
};

PaymentsRest.$inject = ['Restangular', 'MyFormModel'];
angular.module('appModule').factory('PaymentsRest', PaymentsRest);