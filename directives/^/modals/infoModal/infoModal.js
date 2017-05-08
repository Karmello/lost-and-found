(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('infoModal', function() {

		var infoModal = {
			restrict: 'E',
			templateUrl: 'public/directives/^/modals/infoModal/infoModal.html',
			scope: {
				ins: '='
			}
		};

		return infoModal;
	});

})();