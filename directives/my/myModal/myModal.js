(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myModal', function($rootScope, $timeout) {

		return {
			restrict: 'E',
			templateUrl: 'public/directives/my/myModal/myModal.html',
			transclude: {
				header: '?myModalHeader',
				body: '?myModalBody',
				footer: '?myModalFooter'
			},
			scope: {
				ins: '=',
				slideInFromLeft: '='
			},
			controller: function($scope) {},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					// onShow
					$('.modal').on('show.bs.modal', function() {

						$rootScope.isAnyModalOpen = true;
					});

					// onHide
					$('.modal').on('hide.bs.modal', function() {

						$rootScope.isAnyModalOpen = false;

						if (scope.ins.hideCb) {
							$timeout(function() { scope.ins.hideCb(); }, 500);
						}
					});
				};
			}
		};
	});
})();