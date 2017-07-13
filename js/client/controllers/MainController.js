(function() {

	'use strict';

	var MainController = function($scope, exchangeRateService) {

		$scope.exchangeRateService = exchangeRateService;
	};

	MainController.$inject = ['$scope', 'exchangeRateService'];
	angular.module('appModule').controller('MainController', MainController);

})();