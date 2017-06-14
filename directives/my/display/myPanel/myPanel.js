(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('myPanel', function(ui) {

		var myPanel = {
			restrict: 'E',
			templateUrl: 'public/directives/my/display/myPanel/myPanel.html',
			transclude: {
				titleSection: '?titleSection',
				actionSection: '?actionSection',
				bodySection: '?bodySection'
			},
			scope: {
				transHeading: '='
			}
		};

		return myPanel;
	});

})();