(function() {

	'use strict';

	var reportsService = function($rootScope, $state, $stateParams, $timeout, $q, hardDataService, ReportsRest, MyCollectionBrowser) {

		var service = this;
		var hardData = hardDataService.get();

		service.collectionBrowser = {
			newlyAdded: new MyCollectionBrowser({
				singlePageSize: 5,
				noPager: true,
				fetchData: function(query) {

					query.subject = 'newlyAdded';
					query.sort='-dateAdded';
					query.limit = 5;
					return ReportsRest.getList(query);
				}
			}),
			lastViewed: new MyCollectionBrowser({
				singlePageSize: 5,
				hideRefresher: true,
				fetchData: function(query) {

					query.subject = 'lastViewed';
					query.limit = 5;
					return ReportsRest.getList(query);
				}
			}),
			byUser: new MyCollectionBrowser({
				singlePageSize: 25,
				filterer: {
					switchers: [
						{ _id: 'all', label: hardData.status[1] },
						{ _id: 'lost', label: hardData.reportTypes[0].label2 },
						{ _id: 'found', label: hardData.reportTypes[1].label2 }
					]
				},
				sorter: {
					switchers: [
						{ _id: 'title', label: hardData.status[7] },
						{ _id: 'date', label: hardData.status[8] }
					]
				},
				fetchData: function(query) {

					query.subject = 'byUser';
					query.userId = $rootScope.apiData.profileUser._id;
					return ReportsRest.getList(query);
				}
			}),
			bySearchQuery: new MyCollectionBrowser({
				singlePageSize: 25,
				filterer: {
					switchers: [
						{ _id: 'all', label: hardData.status[1] },
						{ _id: 'lost', label: hardData.reportTypes[0].label2 },
						{ _id: 'found', label: hardData.reportTypes[1].label2 }
					]
				},
				sorter: {
					switchers: [
						{ _id: 'title', label: hardData.status[7] },
						{ _id: 'date', label: hardData.status[8] }
					]
				},
				fetchData: function(query) {

					query.subject = 'bySearchQuery';
					var model = ReportsRest.reportSearchModel.getValues();
					Object.assign(query, model);
					return ReportsRest.getList(query);
				}
			})
		};

		service.initReports = function(fromState, fromParams, toState, toParams) {

			var collectionBrowsers = service.collectionBrowser;
			var toStateName = toState.name.split('.')[1];

			switch (toStateName) {

				case 'start':

					if (fromState.name.split('.')[1] != toStateName) { collectionBrowsers.newlyAdded.init(); }
					break;

				case 'home':

					if (fromState.name.split('.')[1] != toStateName) {
						collectionBrowsers.newlyAdded.init();
						collectionBrowsers.lastViewed.init();
					}

					break;

				case 'profile':

					if (fromState.name.split('.')[1] != toStateName || fromParams.id != toParams.id) {
						collectionBrowsers.byUser.init();
					}

					break;

				case 'search':

					if (fromState.name.split('.')[1] != toStateName) { collectionBrowsers.bySearchQuery.init(); }
					break;
			}
		};

		service.deleteReports = function(reports) {

			if (reports && reports.length > 0) {

				// Showing confirm modal
				$rootScope.ui.modals.deleteReportModal.show({
					title: $rootScope.ui.modals.deleteReportModal.title + ' (' + reports.length + ')',
					message: hardData.warnings[2],
					acceptCb: function() {

						var promises = [];
						for (var report of reports) { promises.push(report.remove()); }

						$q.all(promises).then(function(results) {

							switch ($state.current.name) {

								case 'app.profile':

									service.collectionBrowser.byUser.init();
									break;

								case 'app.report':

									service.collectionBrowser.byUser.init();

									$timeout(function() {
										$state.go('app.profile', { id: $rootScope.apiData.loggedInUser._id }, { location: 'replace' });
									});

									break;
							}
						});
					}
				});
			}
		};

		return service;
	};

	reportsService.$inject = ['$rootScope', '$state', '$stateParams', '$timeout', '$q', 'hardDataService', 'ReportsRest', 'MyCollectionBrowser'];
	angular.module('appModule').service('reportsService', reportsService);

})();