(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('confirmModal', function() {

		var confirmModal = {
			restrict: 'E',
			templateUrl: 'public/directives/^/modals/confirmModal/confirmModal.html',
			scope: {
				ins: '='
			}
		};

		return confirmModal;
	});

})();