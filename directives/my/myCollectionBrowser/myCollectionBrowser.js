(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myCollectionBrowser', function() {

		var myCollectionBrowser = {
			restrict: 'E',
			transclude: {
				frontctrls: '?frontctrls',
				endctrls: '?endctrls',
				extractrls: '?extractrls',
				elems: '?elems',
			},
			templateUrl: 'public/directives/my/myCollectionBrowser/myCollectionBrowser.html',
			scope: {
				ins: '=',
				noScrollTopBtn: '='
			}
		};

		return myCollectionBrowser;
	});

})();