(function() {

	'use strict';

	var apiService = function($rootScope, $window, $timeout, $moment, googleMapService, storageService, reportsConf, commentsConf, Restangular) {

		var service = {
			setup: function() {

				Restangular.setBaseUrl('/api');
				Restangular.setFullResponse(true);
				Restangular.setRestangularFields({ id: '_id' });
				Restangular.addResponseInterceptor(service.interceptResponse);

				Restangular.addElementTransformer('users', false, function(user) { return user; });

				Restangular.addElementTransformer('reports', false, function(report) {
					report.startEvent.date = new Date(report.startEvent.date);
					return report;
				});

				Restangular.addElementTransformer('comments', false, function(comment) { return comment; });
			},
			interceptResponse: function(data, operation, what, url, res, deferred) {

				if (data.authToken) { storageService.authToken.setValue(data.authToken); }

				if (data.msg) {
					$timeout(function() {
						var body = { title: data.msg.title, message: data.msg.info };
						if (data.msg.reload) { body.hideCb = function() { $window.location.reload(); }; }
						$rootScope.ui.modals.infoModal.show(body);
					}, 100);
				}



				if (operation == 'getList') {

					if (what == 'users') {

						if (res.config.params) {

							if (res.config.params._id) {
								$rootScope.apiData.profileUser = data[0];

							} else if (res.config.params.reportId) {
								$rootScope.apiData.reportUser = data[0];
							}
						}

					} else if (what == 'reports') {

						if (res.config.params) {

							switch (res.config.params.subject) {

								case 'reports':
									reportsConf.searchCollectionBrowser.setData(data);
									googleMapService.searchReportsMap.addMarkers(data.collection);
									return data.collection;

								case 'new_reports':
									reportsConf.recentlyReportedCollectionBrowser.setData(data);
									return data.collection;

								case 'user_reports':
									reportsConf.profileCollectionBrowser.setData(data);
									return data.collection;

								case 'recently_viewed_reports':
									reportsConf.recentlyViewedCollectionBrowser.setData(data);
									return data.collection;

								case 'report':
									$rootScope.apiData.report = data.report;
									$rootScope.apiData.loggedInUser.reportsRecentlyViewed = data.reportsRecentlyViewed;
									return [data.report];
							}
						}

					} else if (what == 'comments') {

						for (var i in data.collection) { data.collection[i].user = data.users[i]; }
						commentsConf.reportCommentsBrowser.setData(data);
						return data.collection;
					}

				} else if (operation == 'post') {

					if (what == 'users') {

						if (res.config.params.action == 'updatePass') {

							$rootScope.apiData.loggedInUser = data.user;
							return data.user;

						} else {

							$rootScope.apiData.loggedInUser = data.user;
							$rootScope.apiData.appConfig = data.appConfig;
							Restangular.restangularizeElement(undefined, $rootScope.apiData.appConfig, 'app_configs');
							return Restangular.restangularizeCollection(undefined, [data.user], 'users');
						}

					} else if (what == 'reports') {

						return Restangular.restangularizeElement(undefined, data, 'reports');
					}

				} else if (operation == 'put') {

					if (what == 'users') {

						$rootScope.apiData.loggedInUser = data.user;
						return data.user;

					} else if (what == 'app_configs') {

						var appConfig = Restangular.restangularizeElement(undefined, data.appConfig, 'app_configs');
						$rootScope.apiData.appConfig = appConfig;

					} else if (what == 'reports') {

						return data;
					}
				}

				return data;
			}
		};

		return service;
	};

	apiService.$inject = ['$rootScope', '$window', '$timeout', '$moment', 'googleMapService', 'storageService', 'reportsConf', 'commentsConf','Restangular'];
	angular.module('appModule').service('apiService', apiService);

})();