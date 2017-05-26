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



				if (what == 'users') {

					if (operation == 'getList') {

						if (res.config.params._id) {
							$rootScope.apiData.profileUser = data[0];

						} else if (res.config.params.reportId) {
							$rootScope.apiData.reportUser = data[0];
						}

					} else if (operation == 'post') {

						$rootScope.apiData.loggedInUser = data.user;

						if (res.config.params.action == 'updatePass') {
							return data.user;

						} else {

							Restangular.restangularizeElement(undefined, data.appConfig, 'app_configs');
							$rootScope.apiData.appConfig = data.appConfig;
							return Restangular.restangularizeCollection(undefined, [data.user], 'users');
						}

					} else if (operation == 'put') {

						$rootScope.apiData.loggedInUser = data.user;
						return data.user;
					}
				}

				if (what == 'reports') {

					if (operation == 'getList') {

						switch (res.config.params.subject) {

							case 'searchReports':
							case 'recentReports':
							case 'userReports':
							case 'viewedReports':

								reportsConf[res.config.params.subject].setData(data);

								if (res.config.params.subject == 'searchReports') {
									googleMapService.searchReportsMap.addMarkers(data.collection);
								}

								return data.collection;

							case 'singleReport':

								$rootScope.apiData.report = data.report;
								$rootScope.apiData.loggedInUser.reportsRecentlyViewed = data.reportsRecentlyViewed;
								return [data.report];
						}

					} else if (operation == 'post') {

						return Restangular.restangularizeElement(undefined, data, 'reports');
					}
				}

				if (what == 'app_configs') {

					if (operation == 'put') {

						var appConfig = Restangular.restangularizeElement(undefined, data.appConfig, 'app_configs');
						$rootScope.apiData.appConfig = appConfig;
					}
				}

				if (what == 'comments') {

					if (operation == 'getList') {

						for (var i in data.collection) { data.collection[i].user = data.users[i]; }
						commentsConf.reportCommentsBrowser.setData(data);
						return data.collection;
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