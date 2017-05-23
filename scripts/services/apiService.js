(function() {

	'use strict';

	var apiService = function($rootScope, $window, $timeout, $moment, googleMapService, storageService, reportsConf, commentsConf, Restangular) {

		var service = {
			setup: function() {

				Restangular.setBaseUrl('/api');
				Restangular.setFullResponse(true);
				Restangular.setRestangularFields({ id: '_id' });
				Restangular.addResponseInterceptor(service.interceptResponse);

				Restangular.addElementTransformer('users', false, function(user) {

					if (user.username) {
						user.truncatedUsername = user.username.truncate(15);
						user.userSince = $moment.duration($moment(new Date()).diff($moment(user.registration_date))).humanize();
						user.countryFirstLetter = user.country[0];

					} else if (user.user) {
						user.user.truncatedUsername = user.user.username.truncate(15);
						user.user.userSince = $moment.duration($moment(new Date()).diff($moment(user.user.registration_date))).humanize();
						user.user.countryFirstLetter = user.user.country[0];
					}

					return user;
				});

				Restangular.addElementTransformer('reports', false, function(report) {
					report.truncatedTitle = report.title.truncate(25);
					report.startEvent.date = new Date(report.startEvent.date);
					report.formattedDate = $moment(report.startEvent.date).format('DD-MM-YYYY');
					report.formattedDateAdded = $moment(report.dateAdded).format('DD-MM-YYYY HH:mm');
					report.pastSinceAdded = $moment.duration($moment(new Date()).diff($moment(report.dateAdded))).humanize();
					service.createReportFullCategoryString(report);
					return report;
				});

				Restangular.addElementTransformer('comments', false, function(comment) {
					comment.pastSinceAdded = $moment.duration($moment(new Date()).diff($moment(comment.dateAdded))).humanize();
					return comment;
				});
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



				var i;

				switch (what) {

					case 'app_configs':

						var appConfig = Restangular.restangularizeElement(undefined, data.appConfig, 'app_configs');
						$rootScope.apiData.loggedInUser.appConfig = appConfig;
						break;

					case 'users':

						switch (operation) {

							case 'getList':

								if (res.config.params) {

									if (res.config.params._id) {
										$rootScope.apiData.profileUser = data[0];

									} else if (res.config.params.reportId) {
										$rootScope.apiData.reportUser = data[0];
									}
								}

								break;

							case 'post':

								data.user.appConfig = data.appConfig;
								$rootScope.apiData.loggedInUser = data.user;
								Restangular.restangularizeElement(undefined, $rootScope.apiData.loggedInUser.appConfig, 'app_configs');
								return Restangular.restangularizeCollection(undefined, [data.user], 'users');

							case 'put':

								$rootScope.apiData.loggedInUser = data.user;
								return data.user;
						}

						break;

					case 'reports':

						switch (operation) {

							case 'getList':

								if (res.config.params) {

									switch (res.config.params.subject) {

										case 'report':
											$rootScope.apiData.report = data.report;
											$rootScope.apiData.loggedInUser.reportsRecentlyViewed = data.reportsRecentlyViewed;
											return [data.report];

										case 'recently_viewed_reports':
											reportsConf.recentlyViewedCollectionBrowser.setData(data);
											return data.collection;

										case 'user_reports':
											reportsConf.profileCollectionBrowser.setData(data);
											return data.collection;

										case 'reports':
											reportsConf.searchCollectionBrowser.setData(data);
											googleMapService.searchReportsMap.addMarkers(data.collection);
											return data.collection;

										case 'new_reports':
											reportsConf.recentlyReportedCollectionBrowser.setData(data);
											return data.collection;
									}
								}

								break;

							case 'post':

								return Restangular.restangularizeElement(undefined, data, 'reports');

							case 'put':

								return data;
						}

						break;

					case 'comments':

						switch (operation) {

							case 'getList':

								for (i in data.collection) { data.collection[i].user = data.users[i]; }
								commentsConf.reportCommentsBrowser.setData(data);
								break;
						}

						return data.collection;

					case 'payments':

						switch (operation) {

							case 'getList':

								$rootScope.apiData.payment = data[0];
								break;
						}
				}

				return data;
			},
			createReportFullCategoryString: function(report) {

				var category = _.find($rootScope.apiData.reportCategories, function(obj) {
					return obj._id == report.categoryId;
				});

				var subcategory = _.find(category.subcategories, function(obj) {
					return obj._id == report.subcategoryId;
				});

				report.fullCategory = category.label + ' / ' + subcategory.label;
			}
		};

		return service;
	};

	apiService.$inject = ['$rootScope', '$window', '$timeout', '$moment', 'googleMapService', 'storageService', 'reportsConf', 'commentsConf','Restangular'];
	angular.module('appModule').service('apiService', apiService);

})();