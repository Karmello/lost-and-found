(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('myPanel', function(MySwitchable) {

		var myPanel = {
			restrict: 'E',
			templateUrl: 'public/templates/myPanel.html',
			transclude: {
				headingImg: '?headingImg',
				headingText: '?headingText',
				headingMenu: '?headingMenu',
				bodySection: '?bodySection'
			},
			scope: {
				ctrlId: '<',
				isSelectable: '<',
				transparentHeading: '<',
				contextMenuConf: '=',
				data: '='
			},
			controller: function($scope) {},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					scope.$watch(function() { return scope.contextMenuConf; }, function(contextMenuConf) {

						if (contextMenuConf) {
							scope.contextMenu = new MySwitchable(contextMenuConf);
							if (scope.data) { scope.contextMenu.data = scope.data; }

						} else {
							scope.contextMenu = undefined;
						}
					});
				};
			}
		};

		return myPanel;
	});

})();