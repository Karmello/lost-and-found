(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('formActionBtns', function() {

		var formActionBtns = {
			restrict: 'E',
			templateUrl: 'public/directives/^/btns/formActionBtns/formActionBtns.html',
			transclude: true,
			scope: {
				myForm: '='
			},
			controller: function($scope) {

				var clearBtnForms = [
					'loginForm', 'registerForm', 'recoverForm', 'passwordForm', 'deactivationForm', 'itemSearchForm',
					'contactForm', 'itemForm', 'auctionForm', 'commentForm'
				];

				var resetBtnForms = ['regionalForm', 'appearanceForm', 'personalDetailsForm'];

				$scope.myForm.showClearBtn = clearBtnForms.indexOf($scope.myForm.ctrlId) > -1;
				$scope.myForm.showResetBtn = resetBtnForms.indexOf($scope.myForm.ctrlId) > -1;

				switch ($scope.myForm.ctrlId) {

					case 'itemForm':
					case 'auctionForm':
						$scope.myForm.submitBtnPhraseIndex = 1;
						break;

					case 'loginForm':
					case 'registerForm':
					case 'recoverForm':
					case 'commentForm':
						$scope.myForm.submitBtnPhraseIndex = 3;
						break;

					case 'contactForm':
						$scope.myForm.submitBtnPhraseIndex = 4;
						break;

					case 'regionalForm':
					case 'appearanceForm':
					case 'personalDetailsForm':
					case 'passwordForm':
						$scope.myForm.submitBtnPhraseIndex = 5;
						break;

					case 'itemSearchForm':
						$scope.myForm.submitBtnPhraseIndex = 83;
						break;
				}



				$scope.onSubmit = function() { $scope.myForm.submit(); };
				$scope.onClear = function() { $scope.myForm.clear(); };
				$scope.onReset = function() { $scope.myForm.reset(); };
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {


				};
			}
		};

		return formActionBtns;
	});

})();