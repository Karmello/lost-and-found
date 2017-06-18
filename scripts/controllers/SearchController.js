(function() {

	'use strict';

	var SearchController = function($rootScope, $scope, $timeout, reportsService, googleMapService) {

		$scope.collectionBrowser = reportsService.collectionBrowser.bySearchQuery;
		$scope.showMap = true;

		$scope.toggleMap = function() {

			$scope.showMap = !$scope.showMap;

			if ($scope.showMap && googleMapService.searchReportsMap.ins) {
				$timeout(function() {
					google.maps.event.trigger(googleMapService.searchReportsMap.ins, 'resize');
				});
			}
		};
	};

	SearchController.$inject = ['$rootScope', '$scope', '$timeout', 'reportsService', 'googleMapService'];
	angular.module('appModule').controller('SearchController', SearchController);

})();