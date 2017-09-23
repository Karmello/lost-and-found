(function() {

	'use strict';

	var PaymentsRest = function(Restangular, MyDataModel) {

		var payments = Restangular.service('payments');

		payments.paymentModel = new MyDataModel({
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

	PaymentsRest.$inject = ['Restangular', 'MyDataModel'];
	angular.module('appModule').factory('PaymentsRest', PaymentsRest);

})();