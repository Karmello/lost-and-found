(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myCaptcha', function($timeout, grecaptchaService) {

		var myCaptcha = {
			restrict: 'E',
			template: '<div id="{{ ctrlId }}" ng-show="visible" style="margin-bottom: 20px;" my-directive></div>',
			scope: {
				ctrlId: '=',
				actionName: '=',
			},
			controller: function($scope, $timeout) {

				$timeout(function() {

					// Loading captcha
					$scope.grecaptchaId = grecaptchaService.load($scope.ctrlId, $scope.actionName, function() {

						// When captcha resolved callback
						$timeout(function() { $scope.visible = false; }, 1000);
					});
				});
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					// Getting parent form scope
					var form = $(elem).parents('#myForm:first');
					var formScope = $(form).scope();

					scope.$watch('visible', function(newValue) {
						if (newValue === true) { grecaptchaService.reset(scope.grecaptchaId); }
					});



					$timeout(function() {

						// Setting initial captcha visibility
						grecaptchaService.shouldBeVisible(scope.ctrlId, function(visible) {
							formScope.captcha = scope;
							scope.visible = visible;
						});
					});
				};
			}
		};

		return myCaptcha;
	});

})();