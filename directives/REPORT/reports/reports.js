(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('reports', function($rootScope, reportsConf, reportsService, contextMenuConf) {

		var reports = {
			restrict: 'E',
			templateUrl: 'public/directives/REPORT/reports/reports.html',
			scope: {
				ctrlId: '@',
				noAvatar: '=',
				noInfo: '='
			},
			controller: function($scope) {

				$scope.hardData = $rootScope.hardData;
				$scope.apiData = $rootScope.apiData;
				$scope.reportContextMenuConf = contextMenuConf.reportContextMenuConf;
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					switch (scope.ctrlId) {

						case 'UserReports':

							if (!$rootScope.$$listeners.initUserReports) {
								$rootScope.$on('initUserReports', function(e, args) {
									reportsService.initUserReports(scope, args.userId);
								});
							}

							scope.$on('$destroy', function() {
								$rootScope.$$listeners.initUserReports = null;
							});

							scope.$watch('apiData.profileUser._id', function(userId) {
								if (angular.isDefined(userId)) { reportsService.initUserReports(scope, userId); }
							});

							break;

						case 'SearchReports':

							if (!$rootScope.$$listeners.initSearchReports) {
								$rootScope.$on('initSearchReports', function(e, args) {
									scope.collectionBrowser = reportsConf.searchCollectionBrowser;
									scope.collectionBrowser.init();
								});
							}

							scope.$on('$destroy', function() {
								$rootScope.$$listeners.initSearchReports = null;
							});

							scope.collectionBrowser = reportsConf.searchCollectionBrowser;
							scope.collectionBrowser.init();
							break;

						case 'RecentlyViewedReports':

							if (!$rootScope.$$listeners.initRecentlyViewedReports) {
								$rootScope.$on('initRecentlyViewedReports', function(e, args) {
									scope.collectionBrowser = reportsConf.recentlyViewedCollectionBrowser;
									scope.collectionBrowser.init();
								});
							}

							scope.$on('$destroy', function() {
								$rootScope.$$listeners.initRecentlyViewedReports = null;
							});

							scope.collectionBrowser = reportsConf.recentlyViewedCollectionBrowser;
							scope.collectionBrowser.init();
							break;

						case 'NewReports':

							scope.collectionBrowser = reportsConf.recentlyReportedCollectionBrowser;
							scope.collectionBrowser.init();
							break;
					}
				};
			}
		};

		return reports;
	});

})();