(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('reports', function($rootScope, reportsConf, contextMenuConf, reportsService) {

		var reports = {
			restrict: 'E',
			templateUrl: 'public/directives/REPORT/reports/reports.html',
			scope: {
				ctrlId: '@'
			},
			controller: function($scope) {

				$scope.hardData = $rootScope.hardData;
				$scope.apiData = $rootScope.apiData;

				$scope.initUserReports = function(userId) {

					$scope.collectionBrowser = reportsConf.profileCollectionBrowser;

					if (userId == $rootScope.apiData.loggedInUser._id) {
						$scope.elemContextMenuConf = contextMenuConf.reportContextMenuConf;

					} else {
						$scope.elemContextMenuConf = undefined;
					}

					$scope.collectionBrowser.init();
				};
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					if (!$rootScope.$$listeners.initSearchReports) {
						$rootScope.$on('initSearchReports', function(e, args) {
							scope.collectionBrowser = reportsConf.searchCollectionBrowser;
							scope.collectionBrowser.init();
						});
					}

					if (!$rootScope.$$listeners.initUserReports) {
						$rootScope.$on('initUserReports', function(e, args) {
							scope.initUserReports(args.userId);
						});
					}



					switch (scope.ctrlId) {

						case 'UserReports':

							scope.$watch('apiData.profileUser._id', function(userId) {
								if (angular.isDefined(userId)) { scope.initUserReports(userId); }
							});

							break;

						case 'SearchReports':

							scope.collectionBrowser = reportsConf.searchCollectionBrowser;
							scope.collectionBrowser.init();
							break;
					}
				};
			}
		};

		return reports;
	});

})();