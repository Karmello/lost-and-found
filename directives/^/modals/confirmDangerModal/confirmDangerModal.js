(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('confirmDangerModal', function() {

		var confirmDangerModal = {
			restrict: 'E',
			templateUrl: 'public/directives/^/modals/confirmDangerModal/confirmDangerModal.html',
			scope: {
				ins: '='
			}
		};

		return confirmDangerModal;
	});

})();