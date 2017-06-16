(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('myBtn', function($rootScope) {

		var Config = function(scope, mouseState) {

			if (scope.isCreatingConfig) { return; }
			scope.isCreatingConfig = true;

			var btnState = scope.activeBtnState;

			if (scope.hardData) {
				this.label = getValue(scope, btnState, mouseState, 'label');
			}

			if (scope.btnClass) {
				this.btnClass = getValue(scope, btnState, mouseState, 'btnClass');
			}

			if (scope.iconClass) {
				this.iconClass = getValue(scope, btnState, mouseState, 'iconClass');
			}

			scope.activeMouseState = mouseState;
			scope.isCreatingConfig = false;
		};

		var getValue = function(scope, btnState, mouseState, propName) {

			var value;

			switch (propName) {

				case 'label':
					value = scope[propName + '_' + btnState + '_' + mouseState];
					break;

				case 'btnClass':
				case 'iconClass':
					try { value = scope[propName][btnState][mouseState]; } catch (ex) { value = undefined; }
					break;
			}

			if (!value) {

				if (mouseState == 1) {
					return getValue(scope, btnState, 0, propName);

				} else if (btnState == 1) {
					return getValue(scope, 0, 0, propName);
				}

			} else { return value; }
		};

		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'public/directives/my/btn/myBtn/myBtn.html',
			scope: {
				btnClass: '<',
				iconClass: '<',
				hardData: '<',
				onClick: '&',
				state: '=',
				showModalId: '@'
			},
			controller: function($scope) {

				$scope.onMouseEnter = function() {
					$scope.activeConfig = new Config($scope, 1);
				};

				$scope.onMouseLeave = function() {
					$scope.activeConfig = new Config($scope, 0);
				};
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					scope.isCreatingConfig = false;

					scope.$watch('state', function(btnState) {
						scope.activeBtnState = Number(btnState) || 0;
						scope.activeConfig = new Config(scope, scope.activeMouseState || 0);
					});

					scope.$watch('label_0_0', function(label) {
						scope.activeConfig = new Config(scope, scope.activeMouseState || 0);
					});

					if (scope.showModalId) {
						scope.onClick = function() { $rootScope.$broadcast(scope.showModalId); };
					}
				};
			}
		};
	});

})();