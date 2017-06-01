(function() {

	'use strict';

	var PaymentsRest = function(Restangular, MyDataModel) {

		var payments = Restangular.service('payments');

		payments.paymentModel = new MyDataModel({
			paymentMethod: {},
			creditCardType: {},
			creditCardNumber: {},
			creditCardExpireMonth: {},
			creditCardExpireYear: {},
			cvv2: {},
			firstname: {},
			lastname: {},
			amount: {},
			currency: {}
		});

		return payments;
	};

	PaymentsRest.$inject = ['Restangular', 'MyDataModel'];
	angular.module('appModule').factory('PaymentsRest', PaymentsRest);

})();