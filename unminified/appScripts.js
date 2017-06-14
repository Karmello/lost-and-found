(function() {

	'use strict';

	var $q = angular.injector(['ng']).get('$q');
	var $http = angular.injector(['ng']).get('$http');

	var appModule = angular.module('appModule', [
		'ui.bootstrap',
		'ui.router',
		'ngAnimate',
		'restangular',
		'LocalStorageModule',
		'angular-momentjs'
	]);

	$q.all([

		$http.get('public/json/hard_coded/hard_coded_en.json'),
		$http.get('public/json/hard_coded/hard_coded_pl.json'),
		$http.get('/session')

	]).then(function(res) {

		appModule.constant('hardDataConst', { en: res[0].data, pl: res[1].data });
		appModule.constant('sessionConst', res[2].data);
		angular.element(document).ready(function() { angular.bootstrap(document, ['appModule']); });
	});

})();
(function() {

	angular.module('appModule')
	.config(function($urlRouterProvider, $locationProvider, localStorageServiceProvider) {

		$urlRouterProvider.otherwise('/home');
		$locationProvider.html5Mode(false).hashPrefix('');
		localStorageServiceProvider.setPrefix('laf');



		String.prototype.truncate = function (maxLength) {
			var that = this.toString();
		    if (that.length > maxLength) { return that.substr(0, maxLength) + '...'; } else { return that; }
		};
	});

})();
(function() {

	'use strict';

	var urls = {
		AWS3_UPLOADS_BUCKET_URL: 'https://s3.amazonaws.com/laf.useruploads/',
		AWS3_RESIZED_UPLOADS_BUCKET_URL: 'https://s3.amazonaws.com/laf.useruploadsresized/',
		itemImg: 'public/imgs/item.png',
		okImg: 'public/imgs/ok.png'
	};

	var nums = {
		reportMaxPhotos: 10,
		photoMaxSize: 1048576
	};

	angular.module('appModule').constant('URLS', urls);
	angular.module('appModule').constant('NUMS', nums);

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.filter('filterByCategory', function() {

		return function(data, category) {

			if (category) {

				var filteredData = [];

				angular.forEach(data, function(item) {

					if (item.name[0] == category) {
						filteredData.push(item);
					}
				});

				return filteredData;

			} else {
				return data;
			}
		};
	});

})();
(function() {

	angular.module('appModule').run(function(
		$rootScope, $timeout, $state, $moment, apiService, logService, ui, uiThemeService, sessionConst, socketService
	) {

		ui.loaders.renderer.start();
		uiThemeService.include(sessionConst.theme);

		//logService.resetAll();
		socketService.init();
		apiService.setup();

		$moment.locale(sessionConst.language);

		if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }



		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

			if (fromState != toState) { $('.modal').modal('hide'); }
		});

		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

			switch (toState.name) {

				case 'app.start':
				case 'app.settings3':

					if (toState.name == fromState.name) { return; } else {
						fromState.scrollY = window.scrollY;
						window.scrollTo(0, 0);
					}

					break;

				case 'app.profile':
				case 'app.report':

					if (toParams.edit === '1') {
						window.scrollTo(0, 0);
						return;

					} else {

						let lastId = toState.lastId;
						toState.lastId = toParams.id;
						fromState.scrollY = window.scrollY;
						window.scrollTo(0, 0);
						if (lastId != toParams.id || fromParams.edit === '1') { return; }
					}

					break;

				case 'app.report.tabs':
					return;

				default:
					fromState.scrollY = window.scrollY;
					window.scrollTo(0, 0);
					break;
			}

			if (toState.scrollY) {
				$timeout(function() {
					$('html, body').animate({ scrollTop: toState.scrollY }, 'fast');
				}, 500);
			}
		});
	});

})();
(function() {

	'use strict';

	var contextMenuConf = function($rootScope, $state, reportsConf, reportsService) {

		this.reportContextMenuConf = {
			icon: 'glyphicon glyphicon-option-horizontal',
			switchers: [
				{
					_id: 'edit',
					label: $rootScope.hardData.imperatives[33],
					onClick: function() {

						$state.go('app.report', { id: this.parent.data._id, edit: '1' });
					}
				},
				{
					_id: 'delete',
					label: $rootScope.hardData.imperatives[14],
					onClick: function() {

						reportsService.deleteReports([this.parent.data]);
					}
				}
			]
		};

		this.profileReportsContextMenuConf = {
			icon: 'glyphicon glyphicon-option-horizontal',
			switchers: [
				{
					_id: 'select_all',
					label: $rootScope.hardData.imperatives[30],
					onClick: function() {

						reportsConf.userReports.selectAll();
					}
				},
				{
					_id: 'deselect_all',
					label: $rootScope.hardData.imperatives[29],
					onClick: function() {

						reportsConf.userReports.deselectAll();
					}
				},
				{
					_id: 'delete',
					label: $rootScope.hardData.imperatives[31],
					onClick: function() {

						var selectedReports = reportsConf.userReports.getSelectedCollection();
						if (selectedReports.length > 0) { reportsService.deleteReports(selectedReports); }
					}
				}
			]
		};

		return this;
	};

	contextMenuConf.$inject = ['$rootScope', '$state', 'reportsConf', 'reportsService'];
	angular.module('appModule').service('contextMenuConf', contextMenuConf);

})();
(function() {

	'use strict';

	var appFrameConf = function() {

		var config = {
			_ctrlId: 'appFrame',
			switchers: [
				{ _id: 'start' },
				{ _id: 'main' }
			]
		};

		return config;
	};

	var mainFrameConf = function($rootScope, $q, hardDataService) {

		var hardData = hardDataService.get();

		var config = {
			_ctrlId: 'mainFrame',
			switchers: [
				{
					_id: 'home',
					route: '/#/home',
					label: hardData.sections[0],
					icon: 'glyphicon glyphicon-home'
				},
				{
					_id: 'search',
					route: '/#/search',
					label: hardData.imperatives[17],
					icon: 'glyphicon glyphicon-search'
				},
				{
					_id: 'newreport',
					route: '/#/newreport',
					label: hardData.imperatives[32],
					icon: 'glyphicon glyphicon-bullhorn'
				},
				{
					_id: 'profile',
					icon: 'glyphicon glyphicon-user'
				},
				{
					_id: 'upgrade',
					icon: 'glyphicon glyphicon-star',
					label: hardData.sections[25]
				},
				{
					_id: 'about',
					route: '/#/about',
					label: hardData.sections[2],
					icon: 'glyphicon glyphicon-info-sign'
				},
				{
					_id: 'help',
					route: '/#/help',
					label: hardData.sections[3],
					icon: 'glyphicon glyphicon-question-sign'
				},
				{
					_id: 'contact',
					route: '/#/contact',
					label: hardData.sections[4],
					icon: 'glyphicon glyphicon-envelope'
				},
				{
					_id: 'report',
					icon: 'glyphicon glyphicon-file'
				},
				{
					_id: 'settings',
					label: hardData.sections[1],
					icon: 'glyphicon glyphicon-cog',
					getRoute: function(uiCtrls) {

						var catId, subcatId;

						switch (this.parent._ctrlId) {

							case 'mainFrameNav':
								catId = uiCtrls.listGroups.settings.getActiveSwitcher()._id;
								break;

							case 'settingsListGroup':
							case 'settingsCategoriesDropdown':
								catId = this._id;
								break;
						}

						subcatId = uiCtrls.tabs[catId].getActiveSwitcher()._id;
						return '/#/settings/' + catId + '/' + subcatId;
					},
					validateCatId: function(stateParams, uiCtrls) {

						return $q(function(resolve) {

							if (uiCtrls.listGroups.settings.switcherIds.indexOf(stateParams.catId) > -1) {
								resolve(true);

							} else { resolve(false); }
						});
					},
					validateSubcatId: function(stateParams, uiCtrls) {

						return $q(function(resolve) {

							if (uiCtrls.tabs[stateParams.catId].switcherIds.indexOf(stateParams.subcatId) > -1) {
								resolve(true);

							} else { resolve(false); }
						});
					}
				}
			]
		};

		return config;
	};

	appFrameConf.$inject = [];
	mainFrameConf.$inject = ['$rootScope', '$q', 'hardDataService'];

	angular.module('appModule').service('appFrameConf', appFrameConf);
	angular.module('appModule').service('mainFrameConf', mainFrameConf);

})();
(function() {

	'use strict';

	var mainFrameNavConf = function($rootScope, hardDataService) {

		var hardData = hardDataService.get();

		var config = {
			_ctrlId: 'mainFrameNav',
			icon: 'glyphicon glyphicon-option-horizontal',
			switchers: [
				{ _id: 'settings' },
				{ _id: 'separator' },
				{ _id: 'about' },
				{ _id: 'help' },
				{ _id: 'contact' },
				{ _id: 'separator' },
				{
					_id: 'logout',
					route: '/#/start/login',
					label: hardData.imperatives[12],
					icon: 'glyphicon glyphicon-off',
					onClick: function() { $rootScope.logout(); }
				}
			]
		};

		return config;
	};



	mainFrameNavConf.$inject = ['$rootScope', 'hardDataService'];
	angular.module('appModule').service('mainFrameNavConf', mainFrameNavConf);

})();
(function() {

	'use strict';

	var modalsConf = function(hardDataService, MyModal) {

		var hardData = hardDataService.get();

		return {
			infoModal: new MyModal({
				id: 'infoModal'
			}),
			confirmModal: new MyModal({
				id: 'confirmModal'
			}),
			confirmDangerModal: new MyModal({
				id: 'confirmDangerModal'
			}),
			accountRequiredModal: new MyModal({
				typeId: 'infoModal',
				title: hardData.status[5],
				message: hardData.rejections[0]
			}),
			tryAgainLaterModal: new MyModal({
				typeId: 'infoModal',
				title: hardData.status[6],
				message: hardData.rejections[1]
			}),
			tryToRefreshModal: new MyModal({
				typeId: 'infoModal',
				title: hardData.status[6],
				message: hardData.rejections[7]
			}),
			passResetDoneModal: new MyModal({
				typeId: 'infoModal',
				title: hardData.labels[4],
				message: hardData.information[2]
			}),
			deactivationDoneModal: new MyModal({
				typeId: 'infoModal',
				title: hardData.count[7],
				message: hardData.information[6]
			}),
			confirmProceedModal: new MyModal({
				typeId: 'confirmModal',
				message: hardData.warnings[0]
			}),
			confirmDeactivationModal1: new MyModal({
				typeId: 'confirmDangerModal',
				title: hardData.labels[24],
				message: hardData.warnings[1]
			}),
			confirmDeactivationModal2: new MyModal({
				typeId: 'confirmDangerModal',
				title: hardData.labels[24],
				message: hardData.warnings[3]
			}),
			deleteReportModal: new MyModal({
				typeId: 'confirmDangerModal',
				title: hardData.labels[28]
			})
		};
	};

	modalsConf.$inject = ['hardDataService', 'MyModal'];
	angular.module('appModule').service('modalsConf', modalsConf);

})();
(function() {

	'use strict';

	var myStorageConf = function() {

		var authToken = {
			_id: 'auth_token',
			type: 'cookie',
			daysToExpire: 30
		};



		return {
			authToken: authToken
		};
	};



	myStorageConf.$inject = [];
	angular.module('appModule').service('myStorageConf', myStorageConf);

})();
(function() {

	'use strict';

	var settingsListGroupConf = function(hardDataService) {

		var hardData = hardDataService.get();

		var config = {
			_ctrlId: 'settingsListGroup',
			switchers: [
				{
					_id: 'application',
					label: hardData.sections[7]
				},
				{
					_id: 'account',
					label: hardData.sections[8]
				},
				{
					_id: 'danger',
					label: hardData.sections[24]
				}
			]
		};

		return config;
	};

	settingsListGroupConf.$inject = ['hardDataService'];
	angular.module('appModule').service('settingsListGroupConf', settingsListGroupConf);

})();
(function() {

	'use strict';

	var startTabsConf = function(hardDataService) {

		var hardData = hardDataService.get();

		var config = {
			_ctrlId: 'startTabs',
			switchers: [
				{
					_id: 'login',
					label: hardData.sections[17],
					info: hardData.description[0],
					route: '/#/start/login'
				},
				{
					_id: 'register',
					label: hardData.sections[18],
					info: hardData.description[1],
					route: '/#/start/register'
				},
				{
					_id: 'recover',
					label: hardData.labels[4],
					info: hardData.description[2],
					route: '/#/start/recover'
				},
				{
					_id: 'status',
					label: hardData.sections[23],
					info: hardData.information[8],
					route: '/#/start/status'
				}
			]
		};

		return config;
	};

	var settingsTabsConf = function(hardDataService) {

		var hardData = hardDataService.get();

		var tabs = {
			application: {
				_ctrlId: 'appTabs',
				switchers: [
					{
						_id: 'appearance',
						route: '/#/settings/application/appearance',
						label: hardData.sections[10],
						info: hardData.imperatives[34]
					},
					{
						_id: 'regional',
						route: '/#/settings/application/regional',
						label: hardData.sections[9],
						info: hardData.description[5]
					}
				]
			},
			account: {
				_ctrlId: 'accountTabs',
				switchers: [
					{
						_id: 'personal-details',
						route: '/#/settings/account/personal-details',
						label: hardData.sections[12],
						info: hardData.description[3]
					},
					{
						_id: 'password',
						route: '/#/settings/account/password',
						label: hardData.labels[2],
						info: hardData.description[4]
					}
				]
			},
			danger: {
				_ctrlId: 'dangerTabs',
				switchers: [
					{
						_id: 'deactivate',
						route: '/#/settings/danger/deactivate',
						label: hardData.imperatives[26],
						info: hardData.warnings[4]
					}
				]
			}
		};

		return tabs;
	};

	var reportTabsConf = function($rootScope) {

		var getRoute = function() {

			if ($rootScope.apiData.report) {
				return '/#/report/' + this._id + '?id=' + $rootScope.apiData.report._id;
			}
		};

		var config = {
			_ctrlId: 'reportTabs',
			switchers: [
				{
					_id: 'photos',
					getRoute: getRoute,
					onActivate: function() {}
				},
				{
					_id: 'comments',
					getRoute: getRoute,
					onActivate: function() {}
				}
			],
			hardData: { switchers_label: ['sections', [5, 6]] }
		};

		return config;
	};

	startTabsConf.$inject = ['hardDataService'];
	settingsTabsConf.$inject = ['hardDataService'];
	reportTabsConf.$inject = ['$rootScope'];

	angular.module('appModule').service('startTabsConf', startTabsConf);
	angular.module('appModule').service('settingsTabsConf', settingsTabsConf);
	angular.module('appModule').service('reportTabsConf', reportTabsConf);

})();
(function() {

	'use strict';

	var topNavMenuConf = function() {

		var config = {
			_ctrlId: 'topNavMenu',
			switchers: [
				{ _id: 'home' },
				{ _id: 'search' },
				{ _id: 'newreport' }
			]
		};

		return config;
	};



	topNavMenuConf.$inject = [];
	angular.module('appModule').service('topNavMenuConf', topNavMenuConf);

})();
(function() {

	'use strict';

	var AppController = function(
		$rootScope, $scope, $window, $state, storageService, authService, hardDataService, ui, uiSetupService, Restangular, NUMS
	) {

		$rootScope.ui = ui;
		$rootScope.hardData = hardDataService.get();
		$rootScope.Math = window.Math;
		$rootScope.NUMS = NUMS;

		$rootScope.apiData = {
			loggedInUser: undefined,
			appConfig: undefined,
			profileUser: undefined,
			reportUser: undefined,
			report: undefined,
			deactivationReasons: undefined,
			contactTypes: undefined,
			stats: undefined,
			payment: undefined
		};

		$rootScope.localData = {
			countries: { data: undefined }
		};



		$rootScope.logout = function(extraParams, cb) {

			// Resetting ui ctrls
			uiSetupService.reInitCtrls(ui);

			// Resetting form models
			$rootScope.resetRestModels();

			authService.setAsLoggedOut(function() {
				var params = { tab: 'login' };
				if (extraParams) { Object.assign(params, extraParams); }
				$state.go('app.start', params);
				if (cb) { cb(); }
			});
		};

		$rootScope.resetRestModels = function() {

			// to be implemented
		};

		$rootScope.$watch(function() { return storageService.authToken.getValue(); }, function(newValue) {

			Restangular.setDefaultHeaders({ 'x-access-token': newValue });

			// When token is gone but user still logged in then the app will reload
			if (!newValue && authService.state.loggedIn) { $window.location.reload(); }
		});
	};

	AppController.$inject = [
		'$rootScope', '$scope', '$window', '$state', 'storageService', 'authService', 'hardDataService', 'ui', 'uiSetupService',
		'Restangular', 'NUMS'
	];

	angular.module('appModule').controller('AppController', AppController);

})();
(function() {

	'use strict';

	var MainController = function($rootScope, $scope) {


	};

	MainController.$inject = ['$rootScope', '$scope'];
	angular.module('appModule').controller('MainController', MainController);

})();
(function() {

	'use strict';

	var ProfileController = function($scope, $moment, contextMenuConf, reportsConf) {

		$scope.userReports = reportsConf.userReports;
		$scope.profileReportsContextMenuConf = contextMenuConf.profileReportsContextMenuConf;



		$scope.$watch('apiData.profileUser', function(newUser) {

			if (newUser) {
				$scope.userSince = $moment.duration($moment(new Date()).diff($moment(newUser.registration_date))).humanize();
			}
		});
	};

	ProfileController.$inject = ['$scope', '$moment', 'contextMenuConf', 'reportsConf'];
	angular.module('appModule').controller('ProfileController', ProfileController);

})();
(function() {

	'use strict';

	var ReportController = function($rootScope, $scope, $moment, $stateParams, reportsService, contextMenuConf) {

		$scope.params = $stateParams;
		$scope.$moment = $moment;

		$scope.$watch('apiData.report', function(report) {

			if (report && report._isOwn()) {
				$scope.contextMenuConf = contextMenuConf.reportContextMenuConf;

			} else {
				$scope.contextMenuConf = null;
			}
		});

		$scope.reportsService = reportsService;
		$scope.commentsOutData = {};

		$scope.showRespondToReportForm = function() {
			if (!$scope.isRespondToReportFormVisible) {
				$scope.isRespondToReportFormVisible = true;
				$rootScope.$broadcast('onRespondToReportFormShow');
			}
		};

		$rootScope.$on('toggleRespondToReportForm', function(e, args) {
			$scope.isRespondToReportFormVisible = args.visible;
		});
	};

	ReportController.$inject = ['$rootScope', '$scope', '$moment', '$stateParams', 'reportsService', 'contextMenuConf'];
	angular.module('appModule').controller('ReportController', ReportController);

})();
(function() {

	'use strict';

	var SearchController = function($rootScope, $scope, $timeout, reportsConf, googleMapService) {

		$scope.searchReports = reportsConf.searchReports;
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

	SearchController.$inject = ['$rootScope', '$scope', '$timeout', 'reportsConf', 'googleMapService'];
	angular.module('appModule').controller('SearchController', SearchController);

})();
(function() {

	'use strict';

	var SettingsController = function($scope, ui, UsersRest, AppConfigsRest) {

		$scope.$watch('ui.listGroups.settings.activeSwitcherId', function(newValue) {
			if (angular.isDefined(newValue)) { $scope.activeTabs = ui.tabs[newValue]; }
		});

		$scope.$watch('apiData.loggedInUser', function(newUser) {
			if (newUser) {
				UsersRest.personalDetailsModel.set(newUser.plain(), true);
				UsersRest.personalDetailsModel.setValue('countryFirstLetter', newUser.country[0], true);
			}
		});

		$scope.$watch('apiData.appConfig', function(newAppConfig) {
			if (newAppConfig) { AppConfigsRest.appConfigModel.set(newAppConfig, true); }
		});
	};

	SettingsController.$inject = ['$scope', 'ui', 'UsersRest', 'AppConfigsRest'];
	angular.module('appModule').controller('SettingsController', SettingsController);

})();
(function() {

	'use strict';

	var StartController = function($scope, authService) {

		$scope.$watch(function() { return authService.state.loggedIn; }, function(loggedIn) {

			for (var i = 0; i < 3; i++) { $scope.ui.tabs.start.switchers[i].isVisible = !loggedIn; }
			$scope.ui.tabs.start.switchers[3].isVisible = loggedIn;
		});
	};

	StartController.$inject = ['$scope', 'authService'];
	angular.module('appModule').controller('StartController', StartController);

})();
(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.about', {
			url: '/about',
			resolve: {
				isAuthenticated: function(authentication, resolveService) {
					return resolveService.isAuthenticated();
				}
			},
			onEnter: function(ui) {

				ui.frames.main.activateSwitcher('about');
				ui.menus.top.activateSwitcher('about');
				ui.frames.app.activateSwitcher('main');
				ui.loaders.renderer.stop();
			}
		});
	});

})();
(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app', {
			abstract: true,
			resolve: {
				googleRecaptcha: function($q, $timeout) {

					return $q(function(resolve) {

						var url = 'https://www.google.com/recaptcha/api.js?onload=captchaApiLoaded&render=explicit';
						var success = false;

						window.captchaApiLoaded = function() { resolve(success = true); };

						var script = document.createElement('script');
						script.type = 'application/javascript';
						script.async = true;
						script.src = url;
						document.body.appendChild(script);

						$timeout(function() { if (!success) { resolve(false); } }, 20000);
					});
				},
				openExchangeRates: function($q, exchangeRateService) {

					return $q(function(resolve) {

						var promises = [];

						angular.forEach(exchangeRateService.config.availableRates, function(rate, rateKey) {

							var promise = $q(function(resolve) {

								$.getJSON(exchangeRateService.config.api + rateKey + '&callback=?').then(function(data) {
									exchangeRateService.data[rateKey] = data;
									resolve(true);

								}, function() {
									resolve(false);
								});
							});

							promises.push(promise);
						});

						$q.all(promises).then(function(results) {
							resolve(results.indexOf(false) == -1);
						});
					});
				},
				localData: function($q, $http, $rootScope, jsonService) {

					return $q(function(resolve) {

						$http.get('public/json/countries.json').success(function(res) {

							jsonService.sort.objectsByProperty(res, 'name', true, function(sorted) {
								jsonService.group.sortedObjectsByPropFirstLetter(sorted, 'name', function(grouped) {

									$rootScope.localData.countries.data = grouped;
									resolve(true);
								});
							});

						}).error(function() { resolve(false); });
					});
				},
				hardData: function($q, $rootScope) {

					return $q(function(resolve) {

						var sortByLabel = function(array) {

							for (var i = 0; i < array.length; i++) {

								if (array[i].subcategories) {
									array[i].subcategories = sortByLabel(array[i].subcategories);
								}
							}

							return _.sortBy(array, 'label');
						};

						$rootScope.hardData.reportCategories = sortByLabel($rootScope.hardData.reportCategories);
						resolve();
					});
				},
				apiData: function($q, $http, $rootScope, $filter, DeactivationReasonsRest, ContactTypesRest) {

					return $q(function(resolve) {

						var promises = [];

						promises.push(DeactivationReasonsRest.getList());
						promises.push(ContactTypesRest.getList());
						promises.push($http.get('/stats'));

						$q.all(promises).then(function(results) {

							if (_.every(results, ['statusText', 'OK'])) {

								$rootScope.apiData.deactivationReasons = $filter('orderBy')(results[0].data.plain(), 'index');
								$rootScope.apiData.contactTypes = $filter('orderBy')(results[1].data.plain(), 'index');
								$rootScope.apiData.stats = results[2].data;

								resolve(true);

							} else { resolve(false); }
						});
					});
				},
				allResources: function($q, ui, googleRecaptcha, openExchangeRates, localData, hardData, apiData) {

					return $q(function(resolve, reject) {

						if (googleRecaptcha && openExchangeRates && localData && apiData) {
							resolve(true);

						} else {
							reject();
							ui.modals.tryAgainLaterModal.show();
						}
					});
				},
				authentication: function(allResources, authService) {

					return authService.authenticate();
				}
			}
		});
	});

})();
(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.contact', {
			url: '/contact',
			resolve: {
				isAuthenticated: function(authentication, resolveService) {
					return resolveService.isAuthenticated();
				}
			},
			onEnter: function(ui) {

				ui.frames.main.activateSwitcher('contact');
				ui.menus.top.activateSwitcher('contact');
				ui.frames.app.activateSwitcher('main');
				ui.loaders.renderer.stop();
			}
		});
	});

})();
(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.help', {
			url: '/help',
			resolve: {
				isAuthenticated: function(authentication, resolveService) {
					return resolveService.isAuthenticated();
				}
			},
			onEnter: function(ui) {

				ui.frames.main.activateSwitcher('help');
				ui.menus.top.activateSwitcher('help');
				ui.frames.app.activateSwitcher('main');
				ui.loaders.renderer.stop();
			}
		});
	});

})();
(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.home', {
			url: '/home',
			resolve: {
				isAuthenticated: function(authentication, resolveService) {
					return resolveService.isAuthenticated();
				}
			},
			onEnter: function($rootScope, ui) {

				$rootScope.$broadcast('initRecentlyViewedReports');

				ui.menus.top.activateSwitcher('home');
				ui.frames.main.activateSwitcher('home');
				ui.frames.app.activateSwitcher('main');
				ui.loaders.renderer.stop();
			}
		});
	});

})();
(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.newreport', {
			url: '/newreport',
			resolve: {
				isAuthenticated: function(authentication, resolveService) {
					return resolveService.isAuthenticated();
				}
			},
			onEnter: function($rootScope, ui) {

				$rootScope.$broadcast('onAddReportFormShow');

				ui.menus.top.activateSwitcher('newreport');
				ui.frames.main.activateSwitcher('newreport');
				ui.frames.app.activateSwitcher('main');
				ui.loaders.renderer.stop();
			}
		});
	});

})();
(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.profile', {
			url: '/profile?id',
			resolve: {
				isAuthenticated: function(authentication, resolveService) {
					return resolveService.isAuthenticated();
				},
				getUser: function(isAuthenticated, $rootScope, $state, $stateParams, $q, UsersRest, ui) {

					return $q(function(resolve, reject) {

						UsersRest.getList({ _id: $stateParams.id }).then(function(res) {
							$rootScope.apiData.profileUser = res.data[0];
							resolve(true);

						}, function() {

							reject();

							if (!ui.loaders.renderer.isLoading) {
								ui.modals.tryAgainLaterModal.show();

							} else {
								$state.go('app.start', { tab: 'status' }, { location: 'replace' });
							}
						});
					});
				}
			},
			onEnter: function(ui) {

				ui.menus.top.activateSwitcher();
				ui.frames.main.activateSwitcher('profile');
				ui.frames.app.activateSwitcher('main');
				ui.loaders.renderer.stop();
			}
		});
	});

})();
(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.report', {
			url: '/report?id&edit',
			resolve: {
				isAuthenticated: function(authentication, resolveService, $state) {

					return resolveService.isAuthenticated($state.current.name);
				},
				apiData: function(isAuthenticated, $q, $rootScope, $state, $stateParams, UsersRest, ReportsRest) {

					return $q(function(resolve, reject) {

						var promises = [];

						promises.push(UsersRest.getList({ reportId: $stateParams.id }));
						promises.push(ReportsRest.getList({ _id: $stateParams.id, subject: 'singleReport' }));

						$q.all(promises).then(function(results) {

							$rootScope.apiData.reportUser = results[0].data[0];
							$rootScope.apiData.report = results[1].data[0];

							resolve();

						}, function() {
							reject();
							$state.go('app.home', undefined, { location: 'replace' });
						});
				});
				}
			},
			onEnter: function($rootScope, $stateParams, $timeout, ui, googleMapService) {

				if ($stateParams.edit === '1') {
					$rootScope.$broadcast('onEditReportFormShow');

				} else {
					googleMapService.singleReportMap.init($rootScope.apiData.report);
				}

				ui.menus.top.activateSwitcher();
				ui.frames.main.activateSwitcher('report');
				ui.frames.app.activateSwitcher('main');
				ui.loaders.renderer.stop();
			},
			onExit: function($rootScope, ReportsRest, reportFormService) {

				$rootScope.$broadcast('toggleRespondToReportForm', { visible: false });

				ReportsRest.editReportModel.reset(true, true);
				reportFormService.editReportForm.scope.loader.start();
			}
		});
	});

})();
(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.report.tabs', {
			url: '/:tab',
			onEnter: function($stateParams, ui) {

				ui.tabs.report.activateSwitcher($stateParams.tab);
			}
		});
	});

})();
(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.search', {
			url: '/search',
			resolve: {
				isAuthenticated: function(authentication, resolveService) {
					return resolveService.isAuthenticated();
				}
			},
			onEnter: function($timeout, googleMapService, ui) {

				ui.menus.top.activateSwitcher('search');
				ui.frames.main.activateSwitcher('search');
				ui.frames.app.activateSwitcher('main');
				ui.loaders.renderer.stop();

				var timeout = 0;
				if (ui.loaders.renderer.isLoading) { timeout = 4000; }

				$timeout(function() { googleMapService.searchReportsMap.init(); }, timeout);
			}
		});
	});

})();
(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.settings1', {
			url: '/settings',
			resolve: {
				redirection: function($q, $timeout, $state, ui) {

					return $q(function() {

						// Setting catId and subcatId and going to main.setting3 state

						var catId = ui.listGroups.settings.activeSwitcherId;

						$timeout(function() {
							$state.go('app.settings3', {
								catId: catId,
								subcatId: ui.tabs[catId].activeSwitcherId
							}, { location: 'replace' });
						});
					});
				}
			}
		});
	});

})();
(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.settings2', {
			url: '/settings/:catId',
			resolve: {
				catId: function($timeout, $q, $state, $stateParams, ui) {

					return $q(function(resolve, reject) {

						var settingsSwitcher = ui.frames.main.getSwitcher('_id', 'settings');

						settingsSwitcher.validateCatId($stateParams, ui).then(function(validCatId) {

							if (validCatId) {
								resolve();

							} else {

								$timeout(function() {
									$state.go('app.settings1', {}, { location: 'replace' });
								});
							}
						});
					});
				},
				redirection: function(catId, $timeout, $state, $stateParams, ui) {

					// Setting subcatId and going to main.setting3 state

					$timeout(function() {
						$state.go('app.settings3', {
							catId: $stateParams.catId,
							subcatId: ui.tabs[$stateParams.catId].activeSwitcherId
						}, { location: 'replace' });
					});
				}
			}
		});
	});

})();
(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.settings3', {
			url: '/settings/:catId/:subcatId',
			resolve: {
				params: function(authentication, $timeout, $q, $state, $stateParams, ui) {

					return $q(function(resolve, reject) {

						var settingsSwitcher = ui.frames.main.getSwitcher('_id', 'settings');

						$q.all([
							settingsSwitcher.validateCatId($stateParams, ui),
							settingsSwitcher.validateSubcatId($stateParams, ui)

						]).then(function(results) {

							if (!results[0]) {

								reject();

								$timeout(function() {
									$state.go('app.settings1', {}, { location: 'replace' });
								});

							} else if (!results[1]) {

								reject();

								$timeout(function() {
									$state.go('app.settings2', { catId: $stateParams.catId }, { location: 'replace' });
								});

							} else { resolve(); }
						});
					});
				},
				isAuthenticated: function(params, resolveService) {
					return resolveService.isAuthenticated();
				}
			},
			onEnter: function($stateParams, ui) {

				ui.menus.top.activateSwitcher('settings');

				ui.listGroups.settings.activateSwitcher($stateParams.catId);
				ui.dropdowns.settingsCategories.activateSwitcher($stateParams.catId);
				ui.tabs[$stateParams.catId].activateSwitcher($stateParams.subcatId);

				ui.frames.main.activateSwitcher('settings');
				ui.frames.app.activateSwitcher('main');
				ui.loaders.renderer.stop();
			}
		});
	});

})();
(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.start', {
			url: '/start/:tab?action',
			resolve: {
				tab: function(authentication, $q, $state, $stateParams, $timeout, authService, ui) {

					return $q(function(resolve, reject) {

						// Valid tab
						if (ui.tabs.start.switcherIds.indexOf($stateParams.tab) > -1) {

							if (authService.state.authenticated && $stateParams.tab != 'status') {
								reject('status');

							} else if (!authService.state.authenticated && $stateParams.tab == 'status') {
								reject('login');

							} else {
								resolve();
							}

						// Invalid tab
						} else { reject('login'); }

	    			}).then(undefined, function(redirectTab) {

	    				// Reject
	    				$timeout(function() {
							$state.go('app.start', { tab: redirectTab }, { location: 'replace' });
						});
	    			});
				}
			},
			onEnter: function($rootScope, $stateParams, $timeout, ui) {

				ui.tabs.start.activateSwitcher($stateParams.tab);
				ui.frames.main.activateSwitcher();
				ui.frames.app.activateSwitcher('start');
				ui.listGroups.settings.getFirstSwitcher().activate();

				angular.forEach(ui.listGroups.settings.switchers, function(switcher) {
					ui.tabs[switcher._id].getFirstSwitcher().activate();
				});

				ui.loaders.renderer.stop();



				switch ($stateParams.action) {

					case 'deactivation':

						$timeout(function() { ui.modals.deactivationDoneModal.show(); }, 5000);
						break;

					case 'pass_reset':

						if ($stateParams.tab == 'login') {
							$timeout(function() { $rootScope.ui.modals.passResetDoneModal.show(); }, 5000);
						}

						break;
				}
			}
		});
	});

})();
(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.upgrade', {
			url: '/upgrade?id',
			resolve: {
				isAuthenticated: function(authentication, resolveService) {
					return resolveService.isAuthenticated();
				},
				id: function(isAuthenticated, $q, $rootScope, $state, $stateParams, authService) {

					return $q(function(resolve, reject) {

						if (!$stateParams.id) {

							if (authService.state.authenticated) {
								reject();
								$state.go('app.upgrade', { id: $rootScope.apiData.loggedInUser._id }, { location: 'replace' });

							} else {
								reject();
								$state.go('app.start', { tab: 'status' }, { location: 'replace' });
							}

						} else { resolve(); }
					});
				},
				getPayment: function(id, $q, $http, $rootScope, $moment, storageService, ui) {

					return $q(function(resolve, reject) {

						if ($rootScope.apiData.loggedInUser.paymentId) {

							var config = {
								paymentId: $rootScope.apiData.loggedInUser.paymentId,
								headers: { 'x-access-token': storageService.authToken.getValue() }
							};

							$http.get('/paypal/payment', config).success(function(res) {
								res.create_time = $moment(res.create_time).format('DD-MM-YYYY, HH:mm');
								$rootScope.apiData.payment = res;

							}).error(function(res) {
								ui.modals.tryAgainLaterModal.show();
							});
						}

						resolve();
					});
				}
			},
			onEnter: function(ui) {

				ui.menus.top.activateSwitcher();
				ui.frames.main.activateSwitcher('upgrade');
				ui.frames.app.activateSwitcher('main');
				ui.loaders.renderer.stop();
			}
		});
	});

})();
(function() {

	'use strict';

	var apiService = function($rootScope, $window, $timeout, googleMapService, storageService, reportsConf, CommentsRest, Restangular) {

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
					}, 250);
				}



				if (what == 'users') {

					if (operation == 'post') {

						switch (res.config.params.action) {

							case 'auth':
							case 'login':
							case 'register':

								$rootScope.apiData.loggedInUser = Restangular.restangularizeElement(undefined, data.user, 'users');
								$rootScope.apiData.appConfig = Restangular.restangularizeElement(undefined, data.appConfig, 'app_configs');
								break;
						}
					}

				} else if (what == 'reports') {

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

								$rootScope.apiData.loggedInUser.reportsRecentlyViewed = data.reportsRecentlyViewed;
								return [data.report];
						}

					} else if (operation == 'post') {

						return Restangular.restangularizeElement(undefined, data, 'reports');
					}

				} else if (what == 'app_configs') {

					if (operation == 'put') {

						$rootScope.apiData.appConfig.language = res.config.data.language;
						$rootScope.apiData.appConfig.theme = res.config.data.theme;
					}

				} else if (what == 'comments') {

					if (operation == 'getList') {

						for (var i in data.collection) { data.collection[i].user = data.users[i]; }
						CommentsRest.activeCollectionBrowser.setData(data);
						return data.collection;
					}
				}

				return data;
			}
		};

		return service;
	};

	apiService.$inject = ['$rootScope', '$window', '$timeout', 'googleMapService', 'storageService', 'reportsConf', 'CommentsRest','Restangular'];
	angular.module('appModule').service('apiService', apiService);

})();
(function() {

	'use strict';

	var authService = function($rootScope, $window, $q, storageService, sessionConst, UsersRest) {

		var service = {
			state: {
				authenticated: false,
				loggedIn: false
			},
			authenticate: function() {

				return $q(function(resolve) {

					// Token not authenticated yet
					if (!service.state.authenticated) {

						var authToken = storageService.authToken.getValue();

						// Auth token found
						if (authToken) {

							UsersRest.post(undefined, { action: 'auth' }, { 'x-access-token': authToken }).then(function(res) {

								// Successful authentication
								service.setAsLoggedIn(function() {
									resolve(true);
								});

							}, function(res) {

								// Could not authenticate
								service.setAsLoggedOut(function() {
									resolve(false);
								});
							});

						// No auth token
						} else {

							service.setAsLoggedOut(function() {
								resolve(false);
							});
						}

					// Already authenticated
					} else {

						service.state.loggedIn = true;
						resolve(true);
					}
				});
			},
			setAsLoggedIn: function(cb) {

				// Updating state variables
				service.state.authenticated = true;
				service.state.loggedIn = true;

				// Checking if logged in user's appConfig and current session settings defer or not

				var appConfig = $rootScope.apiData.appConfig;

				if (appConfig.language != sessionConst.language || appConfig.theme != sessionConst.theme) {
					$window.location.reload();

				} else if (cb) {
					cb();
				}
			},
			setAsLoggedOut: function(cb) {

				// Updating service state variables
				service.state.authenticated = false;
				service.state.loggedIn = false;

				// Updating other services variables
				storageService.authToken.remove();
				$rootScope.apiData.loggedInUser = undefined;

				if (cb) { cb(); }
			}
		};

		return service;
	};

	authService.$inject = ['$rootScope', '$window', '$q', 'storageService', 'sessionConst', 'UsersRest'];
	angular.module('appModule').service('authService', authService);

})();
(function() {

	'use strict';

	var aws3Service = function($http, storageService) {

		var self = {
			getCredentials: function(subject, body) {

				body.authToken = storageService.authToken.getValue();

				return $http.post('/get_aws3_upload_credentials', body, {
					headers: {
						subject: subject
					}
				});
			},
			makeRequest: function(url, body) {

				return $http.post(url, body, {
					transformRequest: angular.identity,
					headers: { 'Content-Type': undefined }
				});
			}
		};

		return self;
	};



	aws3Service.$inject = ['$http', 'storageService'];
	angular.module('appModule').service('aws3Service', aws3Service);

})();
(function() {

	'use strict';

	var exchangeRateService = function() {

		var config = {
			api: 'https://api.fixer.io/latest?base=',
			availableRates: {
				'USD': { sign: '$' },
				'EUR': { sign: '€' },
				'GBP': { sign: '£' }
			},
			decimalPlaces: 2
		};

		var data = {};

		var methods = {
			format: function(amount, to) {

				if (angular.isDefined(amount) && angular.isDefined(to)) {
					return accounting.formatMoney(amount, config.availableRates[to].sign + ' ', config.decimalPlaces, ',', '.');

				} else { return null; }
			},
			convert: function(amount, from, to) {

				if (Object.keys(data).length > 0) {

					if (angular.isDefined(amount) && angular.isDefined(from) && angular.isDefined(to)) {

						fx.settings = { from: from };
						fx.base = data[to].base;
						fx.rates = data[to].rates;

						return methods.format(fx.convert(amount, { to: to }), to);

					} else { return null; }
				} else { return null; }
			}
		};



		return {
			config: config,
			data: data,
			methods: methods
		};
	};



	exchangeRateService.$inject = [];
	angular.module('appModule').service('exchangeRateService', exchangeRateService);

})();
(function() {

	'use strict';

	var SAME_LOCATION_OFFSET = 0.000015;

	var googleMapService = function($q, $timeout, $state, reportsConf) {

		var service = this;

		service.ins = {
			singleReportMap: undefined
		};

		service.geo = {
			allowed: undefined
		};

		service.singleReportMap = {
			init: function(report) {

				var map;

				if (!service.ins.singleReportMap) {

					map = service.ins.singleReportMap = new google.maps.Map(document.getElementById('reportMap'));
					google.maps.event.addListener(map, 'idle', function() { google.maps.event.trigger(map, 'resize'); });

				} else {

					map = service.ins.singleReportMap;
				}

				var geocoder = new google.maps.Geocoder();

				geocoder.geocode({ 'placeId': report.startEvent.placeId }, function(results, status) {

					$timeout(function() {

						var latLng = new google.maps.LatLng(report.startEvent.lat, report.startEvent.lng);

						map.setCenter(latLng);
						map.setZoom(13);

						var marker = new google.maps.Marker({
							map: map,
							position: latLng,
							icon: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
						});

						var infowindow = new google.maps.InfoWindow();

						marker.addListener('mouseover', function() {
							infowindow.setContent(results[0].formatted_address);
							infowindow.open(map, marker);
						});

						marker.addListener('mouseout', function() {
							infowindow.close();
						});

					});
				});
			}
		};

		service.searchReportsMap = {
			init: function() {

				if (angular.isUndefined(service.geo.allowed)) {

					$q(function(resolve) {

						navigator.geolocation.getCurrentPosition(function(pos) {

							resolve({
								geoAllowed: true,
								coords: pos.coords
							});

						}, function() {

							resolve({
								geoAllowed: false,
								coords: { latitude: 0, longitude: 0 }
							});

						}, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });

					}).then(function(conf) {

						service.searchReportsMap.ins = new google.maps.Map(document.getElementById('reportsMap'), {
							center: new google.maps.LatLng(conf.coords.latitude, conf.coords.longitude),
							zoom: 5
						});

						service.geo.allowed = conf.geoAllowed;

						if (!service.searchReportsMap.markers) {
							service.searchReportsMap.addMarkers(reportsConf.searchReports.collection);
						}
					});

				} else {

					google.maps.event.trigger(service.searchReportsMap.ins, 'resize');
				}
			},
			addMarkers: function(collection) {

				if (collection && angular.isDefined(service.geo.allowed)) {

					var i;

					// Clearing markers
					if (service.searchReportsMap.markerCluster) {
						service.searchReportsMap.markerCluster.clearMarkers();
					}

					// Resetting markers array
					service.searchReportsMap.markers = [];



					$timeout(function() {

						// Adding new markers
						for (i = 0; i < collection.length; i++) {
							service.searchReportsMap.addSingleMarker(collection, i);
						}

						// Creating clusters
						var map = service.searchReportsMap.ins;
						var markers = service.searchReportsMap.markers;
						var imagePath = 'node_modules/js-marker-clusterer/images/m';
						service.searchReportsMap.markerCluster = new MarkerClusterer(map, markers, { imagePath: imagePath });

					}, 1000);
				}
			},
			addSingleMarker: function(collection, i) {

				var infowindow = new google.maps.InfoWindow();
				var iconName = collection[i].startEvent.type == 'lost' ? 'red-dot.png' : 'blue-dot.png';

				var newMarker = new google.maps.Marker({
					map: service.searchReportsMap.ins,
					position: new google.maps.LatLng(collection[i].startEvent.lat, collection[i].startEvent.lng),
					icon: 'https://maps.google.com/mapfiles/ms/icons/' + iconName
				});

				newMarker.addListener('mouseover', function() {
					infowindow.setContent(collection[i].title);
					infowindow.open(service.searchReportsMap.ins, newMarker);
				});

				newMarker.addListener('mouseout', function() {
					infowindow.close();
				});

				newMarker.addListener('click', function() {
					$state.go('app.report', { id: collection[i]._id });
				});

				service.searchReportsMap.markers.push(newMarker);
			}
		};

		return service;
	};

	googleMapService.$inject = ['$q', '$timeout', '$state', 'reportsConf'];
	angular.module('appModule').service('googleMapService', googleMapService);

})();
(function() {

	'use strict';

	var grecaptchaService = function(sessionService) {

		var config = {
			captchas: {},
			load: function(ctrlId, actionName, resolveCallback) {

				if (window.grecaptcha) {

					config.captchas[ctrlId] = { actionName: actionName };

					// This returns grecaptchaId
					return window.grecaptcha.render(ctrlId, {
						sitekey: '6LdwIyQTAAAAABj159-NBLYxFY4vPRuqEBrYB_aE',
						callback: function() { resolveCallback(); }
					});
				}
			},
			reset: function(grecaptchaId) {

				if (window.grecaptcha) {
					window.grecaptcha.reset(grecaptchaId);
				}
			},
			getResponse: function(captchaObj) {

				if (window.grecaptcha && captchaObj) {
					return window.grecaptcha.getResponse(captchaObj.grecaptchaId);
				}
			},
			shouldBeVisible: function(ctrlId, callback) {

				if (window.grecaptcha) {

					sessionService.get().then(function(res) {
						var badActionsCount = res.data.badActionsCount;
						callback(badActionsCount[config.captchas[ctrlId].actionName] >= badActionsCount.max);
					});

				} else { callback(false); }
			}
		};

		return config;
	};



	grecaptchaService.$inject = ['sessionService'];
	angular.module('appModule').service('grecaptchaService', grecaptchaService);

})();
(function() {

	'use strict';

	var hardDataService = function(hardDataConst, sessionConst) {

		var self = {
			all: hardDataConst,
			get: function() {

				return hardDataConst[sessionConst.language || 'en'];
			},
			bind: function(scope) {

				var hardDataSettings;

				if (scope.hardData) {
					hardDataSettings = scope.hardData;

				} else if (scope.ins && scope.ins.hardData) {
					hardDataSettings = scope.ins.hardData;
				}



				// There are hard data settings declared on current ctrl
				if (hardDataSettings) {

					// Getting hard data in active language
					var hardData = self.get();

					// For each setting
					angular.forEach(hardDataSettings, function(fieldSettings, fieldName) {

						var groupName = fieldSettings[0];

						if (Array.isArray(fieldSettings[1])) {

							var stringIndexes = fieldSettings[1];
							var fieldNameParts = fieldName.split('_');

							if (fieldNameParts.length == 2 && fieldNameParts[0] == 'switchers') {

								var i = 0;
								fieldName = fieldNameParts[1];

								angular.forEach(scope.ins.switchers, function(switcher, childKey) {
									if (typeof switcher == 'object') {
										switcher[fieldName] = hardData[groupName][stringIndexes[i++]];
									}
								});

							} else {

								scope[fieldName] = [];

								angular.forEach(stringIndexes, function(stringIndex) {
									scope[fieldName].push(hardData[groupName][stringIndex]);
								});
							}

						} else {

							var stringIndex = fieldSettings[1];
							scope[fieldName] = hardData[groupName][stringIndex];
						}
					});
				}



				if (scope.ins) {

					angular.forEach(scope.ins.switchers, function(switcher, key) {

						if (typeof switcher.label == 'object') {
							switcher.label = switcher.label[self.get()._id];
						}
					});
				}
			}
		};



		return self;
	};



	hardDataService.$inject = ['hardDataConst', 'sessionConst'];
	angular.module('appModule').service('hardDataService', hardDataService);

})();
(function() {

	'use strict';

	var jsonService = function() {

		var get = {
			firstLettersArray: function(items, propName, callback) {

				try {

					var keys = Object.keys(items);
					var firstLetters = [];
					var result = [];

					for (var i = 0; i < keys.length; ++i) {
						firstLetters.push(items[keys[i]][propName][0]);
					}

					$.each(firstLetters, function(i, el){
						if ($.inArray(el, result) === -1) {
							result.push(el);
						}
					});

					callback(result);

				} catch(ex) {
					callback();
				}
			},
			firstElemOf: function(collection) {

				if (Array.isArray(collection)) {
					return collection[0];

				} else {
					return collection[Object.keys(collection)[0]];
				}
			}
		};

		var find = {
			objectByProperty: function(arrayOfObjects, propName, propValue, callback) {

				for (var i = 0; i < arrayOfObjects.length; i++) {

					if (arrayOfObjects[i][propName] == propValue) {
						callback(arrayOfObjects[i]);
					}
				}

				callback(null);
			}
		};

		var sort = {
			objectsByProperty: function(arrayOfObjects, propName, asc, callback) {

				arrayOfObjects.sort(function(a, b) {

					if (a[propName] > b[propName]) {
						return asc ? 1 : -1;

					} else if (a[propName] < b[propName]) {
						return asc ? -1 : 1;

					} else {
						return 0;
					}
				});

				if (callback) { callback(arrayOfObjects); }
			}
		};

		var group = {
			sortedObjectsByPropFirstLetter: function(arrayOfObjects, propName, callback) {

				var grouped = [];
				var currentLetter;

				// For each object in array
				for (var i = 0; i < arrayOfObjects.length; i++) {

					// Getting first letter
					var firstLetter = arrayOfObjects[i][propName][0];

					// When encountered the letter for the first time
					if (firstLetter !== currentLetter) {

						currentLetter = firstLetter;
						grouped.push({ label: currentLetter, children: [] });
					}

					// Inserting current iteration object into its group children array
					grouped[grouped.length - 1].children.push(arrayOfObjects[i]);
				}

				callback(grouped);
			}
		};

		var filter = {
			objectsByProperty: function(arrayOfObjects, condition, cb) {

				var conditionKey = Object.keys(condition)[0];
				var conditionValue = condition[conditionKey];

				var filtered = [];

				angular.forEach(arrayOfObjects, function(obj) {
					if (obj[conditionKey] == conditionValue) { filtered.push(obj); }
				});

				cb(filtered);
			}
		};



		return {
			get: get,
			find: find,
			sort: sort,
			group: group,
			filter: filter
		};
	};



	jsonService.$inject = [];
	angular.module('appModule').service('jsonService', jsonService);

})();
(function(isNode) {

	'use strict';

	var logService = function($http) {

		var urls = {

		'home': 'http://192.168.43.4:7100',
			'work': '',
			'school': '',
			'current': 'home'
		};

		var options = {
			'allowSendingLogs': true
		};

		var logs = { api: [] };

		var reset = function(routeName) {

			post(routeName, undefined);
		};
		var resetAll = function() {

			var routes = Object.keys(logs);
			for (var i = 0; i < routes.length; ++i) { reset(routes[i]); }
		};
		var post = function(routeName, dataToLog) {

			if (options.allowSendingLogs) {

				var url = urls[urls.current] + '/' + routeName;

				$http({
					url: url,
					method: 'POST',
					data: dataToLog,
					headers: { 'Content-Type': 'application/json' }
				});
			}
		};

		var log = function(printLogs, msg, obj) {

			if (printLogs) {

				if (obj) {
					console.log(msg, obj);

				} else {
					console.log(msg);
				}
			}
		};

		return {
			urls: urls,
			options: options,
			logs: logs,
			reset: reset,
			resetAll: resetAll,
			post: post,
			log: log
		};
	};



	if (!isNode) {
		logService.$inject = ['$http'];
		angular.module('appModule').service('logService', logService);

	} else {
		module.exports = new logService().logs;
	}

})(typeof module !== 'undefined' && module.exports);
(function() {

	'use strict';

	var resolveService = function($q, $state, authService, ui) {

		return {
			isAuthenticated: function(currentStateName) {

				return $q(function(resolve, reject) {

					if (authService.state.authenticated) {
						resolve();

					} else {

						reject();

						if (currentStateName == 'app.start') {
							ui.modals.accountRequiredModal.show();

						} else {
							$state.go('app.start', { tab: 'status' }, { location: 'replace' });
						}
					}
				});
			}
		};
	};

	resolveService.$inject = ['$q', '$state', 'authService', 'ui'];
	angular.module('appModule').service('resolveService', resolveService);

})();
(function() {

	'use strict';

	var serverMsgService = function(hardDataService) {

		var service = {};
		var hardData = hardDataService.get();

		service.getValidationErrMsg = function(error) {

			if (typeof hardData.validation[error.kind] == 'string') {
				return hardData.validation[error.kind];

			} else if (Array.isArray(hardData.validation[error.kind])) {

				var limits = error.properties.limits;

				if (limits) {

					if (limits.min && limits.max) {
						return hardData.validation[error.kind][1] + ' ' + limits.min + '-' + limits.max;

					} else {
						return hardData.validation[error.kind][0] + ' ' + limits.max;
					}
				}
			}
		};

		return service;
	};

	serverMsgService.$inject = ['hardDataService'];
	angular.module('appModule').service('serverMsgService', serverMsgService);

})();
(function() {

	'use strict';

	var sessionService = function($http) {

		var session = {
			get: function(callback) {

				return $http.get('/session');
			}
		};

		return session;
	};



	sessionService.$inject = ['$http'];
	angular.module('appModule').service('sessionService', sessionService);

})();
(function() {

	'use strict';

	var socketService = function($rootScope) {

		var service = this;

		service.init = function() {

			service.socket = io('https://localhost:8080');
			service.socket.on('UpdateAppStats', service.onUpdateAppStats);
		};

		service.onUpdateAppStats = function(data) {

			Object.assign($rootScope.apiData.stats, data);
			$rootScope.$apply();
		};

		return service;
	};

	socketService.$inject = ['$rootScope'];
	angular.module('appModule').service('socketService', socketService);

})();
(function() {

	'use strict';

	var storageService = function(myStorageConf, MyStorageItem) {

		var storageItems = {};

		angular.forEach(myStorageConf, function(config, key) {
			storageItems[key] = new MyStorageItem(config);
		});



		return storageItems;

	};



	storageService.$inject = ['myStorageConf', 'MyStorageItem'];
	angular.module('appModule').service('storageService', storageService);

})();
(function() {

	'use strict';

	var ui = function(
		appFrameConf, mainFrameConf, topNavMenuConf, settingsListGroupConf, startTabsConf, settingsTabsConf,
		reportTabsConf, mainFrameNavConf, modalsConf, myClass, uiSetupService
	) {

		angular.forEach(mainFrameConf.switchers, function(source) {

			_.assign(_.find(topNavMenuConf.switchers, function(target) {
				return target._id == source._id;
			}), source);

			_.assign(_.find(mainFrameNavConf.switchers, function(target) {
				return target._id == source._id;
			}), source);
		});



		var ctrls = {
			frames: {
				app: new myClass.MySwitchable(appFrameConf),
				main: new myClass.MySwitchable(mainFrameConf)
			},
			menus: {
				top: new myClass.MySwitchable(topNavMenuConf)
			},
			listGroups: {
				settings: new myClass.MySwitchable(settingsListGroupConf)
			},
			tabs: {
				start: new myClass.MySwitchable(startTabsConf),
				application: new myClass.MySwitchable(settingsTabsConf.application),
				account: new myClass.MySwitchable(settingsTabsConf.account),
				payment: new myClass.MySwitchable(settingsTabsConf.payment),
				danger: new myClass.MySwitchable(settingsTabsConf.danger),
				report: new myClass.MySwitchable(reportTabsConf)
			},
			dropdowns: {
				mainFrameNav: new myClass.MySwitchable(mainFrameNavConf),
				settingsCategories: new myClass.MySwitchable($.extend(true, { _ctrlId: 'settingsCategoriesDropdown', class: 'dropdown' }, settingsListGroupConf))
			},
			modals: modalsConf,
			loaders: {
				renderer: new myClass.MyLoader()
			}
		};



		uiSetupService.bindGetRouteMethod(ctrls);
		return ctrls;
	};

	ui.$inject = [
		'appFrameConf', 'mainFrameConf', 'topNavMenuConf', 'settingsListGroupConf', 'startTabsConf', 'settingsTabsConf',
		'reportTabsConf', 'mainFrameNavConf', 'modalsConf', 'myClass', 'uiSetupService'
	];

	angular.module('appModule').service('ui', ui);

})();
(function() {

	'use strict';

	var uiSetupService = function() {

		var actions = {
			bindGetRouteMethod: function(uiCtrls) {

				var settingsSwitcher = uiCtrls.frames.main.getSwitcher('_id', 'settings');



				uiCtrls.dropdowns.mainFrameNav.getSwitcher('_id', 'settings').getRoute = function() {
					return settingsSwitcher.getRoute.call(this, uiCtrls);
				};

				angular.forEach(uiCtrls.listGroups.settings.switchers, function(switcher, key) {

					switcher.getRoute = function() {
						return settingsSwitcher.getRoute.call(this, uiCtrls);
					};

					uiCtrls.dropdowns.settingsCategories.switchers[key].getRoute = function() {
						return settingsSwitcher.getRoute.call(this, uiCtrls);
					};
				});
			},
			reInitCtrls: function(uiCtrls) {}
		};

		return actions;
	};



	uiSetupService.$inject = [];
	angular.module('appModule').service('uiSetupService', uiSetupService);

})();
(function() {

	'use strict';

	var uiThemeService = function() {

		var self = {
			themes: {
				standard: '<link href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/flatly/bootstrap.min.css" rel="stylesheet" integrity="sha384-+ENW/yibaokMnme+vBLnHMphUYxHs34h9lpdbSLuAwGkOKFRl4C34WkjazBtb7eT" crossorigin="anonymous">',
				darkly: '<link href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/darkly/bootstrap.min.css" rel="stylesheet" integrity="sha384-S7YMK1xjUjSpEnF4P8hPUcgjXYLZKK3fQW1j5ObLSl787II9p8RO9XUGehRmKsxd" crossorigin="anonymous">',
				cerulean: '<link href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/cerulean/bootstrap.min.css" rel="stylesheet" integrity="sha384-zF4BRsG/fLiTGfR9QL82DrilZxrwgY/+du4p/c7J72zZj+FLYq4zY00RylP9ZjiT" crossorigin="anonymous">',
				slate: '<link href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/slate/bootstrap.min.css" rel="stylesheet" integrity="sha384-RpX8okQqCyUNG7PlOYNybyJXYTtGQH+7rIKiVvg1DLg6jahLEk47VvpUyS+E2/uJ" crossorigin="anonymous">',
				cosmo: '<link href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/cosmo/bootstrap.min.css" rel="stylesheet" integrity="sha384-h21C2fcDk/eFsW9sC9h0dhokq5pDinLNklTKoxIZRUn3+hvmgQSffLLQ4G4l2eEr" crossorigin="anonymous">'

			},
			include: function(themeId) {

				if (themeId != 'raw') {
					$('head').append(self.themes[themeId]);
				}

				$('head').append('<link rel="stylesheet" href="public/appStyles.css" />');
			}
		};

		return self;
	};

	uiThemeService.$inject = [];
	angular.module('appModule').service('uiThemeService', uiThemeService);

})();
(function() {

	'use strict';

	var utilService = function() {

		var dataURItoBlob = function(dataURI) {

			// convert base64/URLEncoded data component to raw binary data held in a string
			var byteString;

			if (dataURI.split(',')[0].indexOf('base64') >= 0)
				byteString = atob(dataURI.split(',')[1]);
			else
				byteString = unescape(dataURI.split(',')[1]);

			// separate out the mime component
			var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

			// write the bytes of the string to a typed array
			var ia = new Uint8Array(byteString.length);

			for (var i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}

			var blob = new Blob([ia], { type: mimeString });
			return blob;
		};



		return {
			dataURItoBlob: dataURItoBlob
		};
	};



	utilService.$inject = [];
	angular.module('appModule').service('utilService', utilService);

})();
(function() {

	'use strict';

	var myClass = function(
		MySwitchable, MySwitcher, MyLoader, MyModal, MySrc, MyStorageItem, MyDataModel, MyCollectionBrowser, MySrcCollection,
		MyForm, MySrcAction
	) {

		return {
			MySwitchable: MySwitchable,
			MySwitcher: MySwitcher,
			MyLoader: MyLoader,
			MyModal: MyModal,
			MySrc: MySrc,
			MyStorageItem: MyStorageItem,
			MyDataModel: MyDataModel,
			MyCollectionBrowser: MyCollectionBrowser,
			MySrcCollection: MySrcCollection,
			MyForm: MyForm,
			MySrcAction: MySrcAction
		};
	};

	myClass.$inject = [
		'MySwitchable', 'MySwitcher', 'MyLoader', 'MyModal', 'MySrc', 'MyStorageItem', 'MyDataModel', 'MyCollectionBrowser',
		'MySrcCollection', 'MyForm', 'MySrcAction'
	];

	angular.module('appModule').factory('myClass', myClass);

})();
(function() {

	'use strict';

	var MyCollectionBrowser = function(hardDataService, MyCollectionSelector, MySwitchable, MyLoader) {

		var hardData = hardDataService.get();

		var MyCollectionBrowser = function(config) {

			Object.assign(MyCollectionBrowser.prototype, $.extend(true, {}, MyCollectionSelector.prototype));

			// Assigning config
			Object.assign(this, config);

			// Defining ctrls configs
			this.ctrls = [
				{ name: 'pager', paramName: 'page' },
				{ name: 'filterer', paramName: 'filter' },
				{ name: 'sorter', paramName: 'sort' },
				{ name: 'orderer', paramName: 'order' }
			];

			// Initializing filterer
			if (this.filterer) {
				this.filterer = new MySwitchable(this.filterer);
				this.filterer._id = 'filterer';
			}

			// Initializing sorter and orderer
			if (this.sorter) {

				this.sorter = new MySwitchable(this.sorter);
				this.sorter._id = 'sorter';

				for (var i in this.sorter.switchers) { this.sorter.switchers[i].onClick = this.onClick; }

				this.orderer = new MySwitchable({
					switchers: [
						{ _id: 'asc', label: hardData.status[3] },
						{ _id: 'desc', label: hardData.status[4] }
					]
				});

				this.orderer._id = 'orderer';
			}

			// Other
			this.refresher = {};
			this.loader = new MyLoader(250);
		};

		MyCollectionBrowser.prototype.init = function(cb) {

			var that = this;

			// Fetching collection to display

			try {

				that.loader.start(false, function() {

					if (that.beforeInit) { that.beforeInit(); }

					that.fetchData(that.createFetchQuery()).then(function(res) {

						// Initializing pager ctrl

						if (that.noPager) { that.meta.count = that.collection.length; }

						if (that.meta.count > 0) {

							var numOfPages = Math.ceil(that.meta.count / that.singlePageSize);
							var pagerSwitchers = [];

							for (var i = 0; i < numOfPages; i++) {
								pagerSwitchers.push({ _id: i + 1, label: '#' + (i + 1) });
							}

							var currentPage;

							if (that.pager) {
								currentPage = that.pager.activeSwitcherId;
							}

							that.pager = new MySwitchable({ _id: 'pager', switchers: pagerSwitchers });

							if (currentPage) {
								that.pager.activateSwitcher(currentPage);
							}

						} else { that.pager = undefined; }

						// Binding choose event for all ctrls

						var exec = function(switcher) {
							switcher.onClick = function() { that.onChoose(switcher); };
						};

						for (var j in that.ctrls) {
							if (that[that.ctrls[j].name]) {
								angular.forEach(that[that.ctrls[j].name].switchers, exec);
							}
						}

						// Finishing
						that.loader.stop(function() {
							if (cb) { cb.call(that, true); }
						});

					}, function(res) {

						that.flush();
						that.loader.stop(function() { if (cb) { cb.call(that, false); } });
					});
				});

			} catch (ex) {

				that.flush();
				that.loader.stop(function() { if (cb) { cb.call(that, false); } });
			}
		};

		MyCollectionBrowser.prototype.setData = function(data) {

			this.meta = data.meta;
			this.collection = data.collection;
		};

		MyCollectionBrowser.prototype.onRefreshClick = function() {

			var that = this;

			var currentPage;
			if (that.pager) { currentPage = that.pager.activeSwitcherId; }

			that.init(function() {

				if (that.pager && angular.isDefined(currentPage)) {

					if (currentPage <= that.pager.switcherIds.length) {
						that.pager.activateSwitcher(currentPage);

					} else {
						that.pager = undefined;
						that.onRefreshClick();
					}
				}

				if (that.refreshCb) { that.refreshCb(); }
			});
		};

		MyCollectionBrowser.prototype.createFetchQuery = function() {

			var query = {};

			if (this.pager && this.pager.activeSwitcherId) {
				query.skip = (this.pager.activeSwitcherId - 1) * this.singlePageSize;

			} else { query.skip = 0; }

			if (this.filterer) {
				query.filter = this.filterer.activeSwitcherId;
			}

			if (this.sorter) {
				query.sort = this.sorter.activeSwitcherId;
				if (this.orderer && this.orderer.activeSwitcherId == 'desc') { query.sort = '-' + query.sort; }
			}

			if (this.orderer) {
				query.order = this.orderer.activeSwitcherId;
			}

			return query;
		};

		MyCollectionBrowser.prototype.getElemNumber = function(index) {

			if (this.pager && this.pager.activeSwitcherId) {
				return (this.pager.activeSwitcherId - 1) * this.singlePageSize + index + 1;
			}
		};

		MyCollectionBrowser.prototype.onChoose = function(switcher) {

			var that = this;
			var currentPage;

			// If choosing inactive switcher
			if (switcher._id != switcher.parent.activeSwitcherId) {

				// Activating chosen switcher
				switcher.activate();

				// Storing pager's active switcher id for later
				if (that.pager) {
					currentPage = that.pager.activeSwitcherId;
				}

				if (switcher.parent._id == 'pager') {

					// Reinitializing
					that.init(function() {

						// Activating stored pager's switcher
						if (that.pager && angular.isDefined(currentPage)) {
							that.pager.activateSwitcher(currentPage);
						}

						// If ctrl other than pager is being switched
						if (switcher.parent._id !== 'pager') {
							that[switcher.parent._id].activateSwitcher(switcher._id);
						}
					});
				}
			}
		};

		MyCollectionBrowser.prototype.flush = function() {

			this.pager = undefined;
			this.filterer = undefined;
			this.sorter = undefined;
			this.orderer = undefined;
		};

		MyCollectionBrowser.prototype.isReady = function() {

			return !this.loader.isLoading && this.refresher;
		};

		return MyCollectionBrowser;
	};

	MyCollectionBrowser.$inject = ['hardDataService', 'MyCollectionSelector', 'MySwitchable', 'MyLoader'];
	angular.module('appModule').factory('MyCollectionBrowser', MyCollectionBrowser);

})();
(function() {

	'use strict';

	var MyCollectionSelector = function() {

		var MyCollectionSelector = function() {};

		MyCollectionSelector.prototype.selectAll = function() {

			for (var i = 0; i < this.collection.length; i++) {
				this.collection[i].isSelected = true;
			}
		};

		MyCollectionSelector.prototype.deselectAll = function() {

			for (var i = 0; i < this.collection.length; i++) {
				this.collection[i].isSelected = false;
			}
		};

		MyCollectionSelector.prototype.getSelectedCollection = function() {

			var selected = [];

			for (var i = 0; i < this.collection.length; i++) {
				if (this.collection[i].isSelected) { selected.push(this.collection[i]); }
			}

			return selected;
		};

		return MyCollectionSelector;
	};

	MyCollectionSelector.$inject = [];
	angular.module('appModule').factory('MyCollectionSelector', MyCollectionSelector);

})();
(function() {

	'use strict';

	var MyDataModel = function(serverMsgService) {

		var MyDataModelValue = function() {

			this.value = { active: undefined, default: undefined };
			this.error = { kind: undefined, message: undefined };
		};

		var MyDataModel = function(myModelConf) {

			var goThrough = function(obj) {

				for (var prop in obj) {

					if (!_.isEmpty(obj[prop])) {
						goThrough(obj[prop]);

					} else {
						obj[prop] = new MyDataModelValue();
					}
				}

				return myModelConf;
			};

			Object.assign(this, goThrough(myModelConf));
		};

		MyDataModel.prototype = {
			set: function(data, storeDefault) {

				var goThrough = function(toSetWithObj, toBeSetObj) {

					for (var prop in toSetWithObj) {

						if (toSetWithObj.hasOwnProperty(prop) && toBeSetObj.hasOwnProperty(prop)) {

							if (toBeSetObj[prop] instanceof MyDataModelValue) {
								toBeSetObj[prop].value.active = toSetWithObj[prop];
								if (storeDefault) { toBeSetObj[prop].value.default = toSetWithObj[prop]; }

							} else {
								goThrough(toSetWithObj[prop], toBeSetObj[prop]);
							}
						}
					}
				};

				goThrough(data, this);
			},
			setValue: function(propPath, newValue, storeDefault) {

				var props = propPath.split('.');
				var obj = this;

				for (var prop of props) {
					obj = obj[prop];
				}

				obj.value.active = newValue;
				if (storeDefault) { obj.value.default = newValue; }
			},
			assignTo: function(data) {

				var goThrough = function(toSetWithObj, toBeSetObj) {

					for (var prop in toSetWithObj) {

						if (toSetWithObj.hasOwnProperty(prop) && toBeSetObj.hasOwnProperty(prop)) {

							if (toSetWithObj[prop] instanceof MyDataModelValue) {
								toBeSetObj[prop] = toSetWithObj[prop].value.active;

							} else {
								goThrough(toSetWithObj[prop], toBeSetObj[prop]);
							}
						}
					}
				};

				goThrough(this, data);
			},
			reset: function(doForValues, doForErrors, useDefaults) {

				var goThrough = function(obj) {

					for (var prop in obj) {

						if (obj.hasOwnProperty(prop)) {

							if (obj[prop] instanceof MyDataModelValue) {

								if (doForValues) {
									obj[prop].value.active = useDefaults ? obj[prop].value.default : undefined;
								}

								if (doForErrors) {
									obj[prop].error.kind = undefined;
									obj[prop].error.message = undefined;
								}

							} else {
								goThrough(obj[prop]);
							}
						}
					}
				};

				goThrough(this);
			},
			setErrors: function(errors, cb) {

				var goThrough = function(obj, toBeSetObj) {

					for (var prop in obj) {

						if (obj.hasOwnProperty(prop) && toBeSetObj.hasOwnProperty(prop)) {

							if (toBeSetObj[prop] instanceof MyDataModelValue) {

								toBeSetObj[prop].error.kind = obj[prop].kind;
								toBeSetObj[prop].error.message = serverMsgService.getValidationErrMsg(obj[prop]);

							} else {
								goThrough(obj[prop], toBeSetObj[prop]);
							}
						}
					}
				};

				var that = this;

				that.clearErrors(function() {
					goThrough(errors, that);
					if (cb) { cb(); }
				});
			},
			clearErrors: function(cb) {

				this.reset(false, true);
				if (cb) { cb(); }
			},
			getValues: function() {

				var goThrough = function(obj, myModelValues) {

					for (var prop in obj) {

						if (obj.hasOwnProperty(prop)) {

							if (obj[prop] instanceof MyDataModelValue) {
								myModelValues[prop] = obj[prop].value.active;

							} else {
								goThrough(obj[prop], myModelValues[prop] = {});
							}
						}
					}

					return myModelValues;
				};

				return goThrough(this, {});
			},
			getValue: function(propPath) {

				var props = propPath.split('.');
				var obj = this;

				for (var prop of props) {
					obj = obj[prop];
				}

				return obj.value.active;
			},
			trimValues: function(ctrlId, cb) {

				var goThrough = function(obj, propPath) {

					if (propPath != '') { propPath += '_'; }

					for (var prop in obj) {

						if (obj.hasOwnProperty(prop)) {

							if (obj[prop] instanceof MyDataModelValue) {

								if (typeof obj[prop].value.active != 'number') {

									var htmlCtrl = $('#' + ctrlId + ' #' + propPath + prop);

									if (htmlCtrl.length > 0) {

										var value = $(htmlCtrl).val();

										if (value) {
											var trimmed = value.trim();
											obj[prop].value.active = trimmed;
											$(htmlCtrl).val(trimmed);

										} else {
											obj[prop].value.active = undefined;
										}
									}
								}

							} else {
								goThrough(obj[prop], propPath + prop);
							}
						}
					}
				};

				goThrough(this, '');
				if (cb) { cb(); }
			}
		};

		return MyDataModel;
	};

	MyDataModel.$inject = ['serverMsgService'];
	angular.module('appModule').factory('MyDataModel', MyDataModel);

})();
(function() {

	'use strict';

	var MyForm = function($rootScope, $window, $timeout, grecaptchaService) {

		MyForm = function(config) {

			this.ctrlId = config.ctrlId;
			this.model = config.model;
			this.reload = config.reload;
			this.noLoader = config.noLoader;
			this.redirectOnSuccess = config.redirectOnSuccess;

			this.submitAction = config.submitAction;
			this.submitSuccessCb = config.submitSuccessCb;
			this.submitErrorCb = config.submitErrorCb;
			this.onCancel = config.onCancel;
		};

		MyForm.prototype.submit = function() {

			var that = this;

			if (!that.scope.captcha || that.scope.captcha.visible === false) {

				// Starting loader
				that.scope.loader.start(false, function() {

					// Model procedures
					that.model.trimValues(that.scope.ctrlId, function() {

						var args = {};
						console.log(that.ctrlId);
						args.captchaResponse = grecaptchaService.getResponse(that.scope.captcha);

						// Calling external submit action, usually making http request
						var promise = that.submitAction(args);

						if (promise) {

							promise.then(function(res) {

								if (!that.redirectOnSuccess) {
									that.model.clearErrors(function() {
										$timeout(function() {
											that.scope.loader.stop();
										});
									});
								}

								if (that.submitSuccessCb) { that.submitSuccessCb(res); }

							}, function(res) {

								// Binding errors if any
								if (res && res.data && res.data.errors) {
									that.model.setErrors(res.data.errors, function() {
										$timeout(function() {
											that.scope.loader.stop();
										});
									});

								// Showing error modal when no server errors to bind
								} else {

									that.model.clearErrors(function() {
										$timeout(function() {
											that.scope.loader.stop(function() {
												$rootScope.ui.modals.tryAgainLaterModal.show();
											});
										});
									});
								}

								if (that.scope.captcha) {
									grecaptchaService.shouldBeVisible(that.scope.captcha.ctrlId, function(visible) {
										$timeout(function() { that.scope.captcha.visible = visible; }, 500);
									});
								}

								if (that.submitErrorCb) { that.submitErrorCb(res); }
							});
						}
					});
				});
			}
		};

		MyForm.prototype.clear = function() {

			this.model.reset(true, true);
		};

		MyForm.prototype.reset = function() {

			this.model.reset(true, true, true);
		};

		return MyForm;
	};

	MyForm.$inject = ['$rootScope', '$window', '$timeout', 'grecaptchaService'];
	angular.module('appModule').factory('MyForm', MyForm);

})();
(function() {

	'use strict';

	var MyLoader = function($timeout) {

		var MyLoader = function(_minLoadTime) {

			if (_minLoadTime) { this.minLoadTime = _minLoadTime; } else { this.minLoadTime = 150; }
			this.isLoading = false;
		};

		MyLoader.prototype.start = function(stopAutomagically, callback) {

			var that = this;
			that.isLoading = true;

			$timeout(function() {
				if (callback) { callback(); }
				if (stopAutomagically) { that.stop(); }
			}, that.minLoadTime);
		};

		MyLoader.prototype.stop = function(callback) {

			this.isLoading = false;
			if (callback) { callback(); }
		};

		return MyLoader;
	};

	MyLoader.$inject = ['$timeout'];
	angular.module('appModule').factory('MyLoader', MyLoader);

})();
(function() {

	'use strict';

	var MyModal = function($rootScope, $timeout) {

		var MyModal = function(config) {

			Object.assign(this, config);
		};

		MyModal.prototype.prepareToShow = function(args, cb) {

			var typeModal;

			if (this.typeId) {
				typeModal = $rootScope.ui.modals[this.typeId];
				typeModal.flush();
			}

			if (typeModal) {

				Object.assign(typeModal, this);
				Object.assign(typeModal, args);
				cb(typeModal);

			} else {

				Object.assign(this, args);
				cb(this);
			}
		};

		MyModal.prototype.show = function(args) {

			var that = this;

			that.prepareToShow(args, function(modalForShow) {

				if ($rootScope.isAnyModalOpen) {

					$('.modal').modal('hide');
					$timeout(function() { $('#' + modalForShow.id).modal('show'); }, modalForShow.timeout);

				} else {

					$timeout(function() { $('#' + modalForShow.id).modal('show'); });
				}
			});
		};

		MyModal.prototype.hide = function(cb) {

			$('#' + this.id).modal('hide');
			if (cb) { $timeout(function() { cb(); }, this.timeout); }
		};

		MyModal.prototype.accept = function() {

			var that = this;
			$('#' + that.id).modal('hide');
			if (that.acceptCb) { $timeout(function() { that.acceptCb(); }, that.timeout); }
		};

		MyModal.prototype.dismiss = function() {

			var that = this;
			$('#' + that.id).modal('hide');
			if (that.dismissCb) { $timeout(function() { that.dismissCb(); }, that.timeout); }
		};

		MyModal.prototype.flush = function() {

			var keys = Object.keys(this);

			for (var i in keys) {
				if (keys[i] != 'id') { this[keys[i]] = undefined; }
			}
		};

		MyModal.prototype.timeout = 500;

		return MyModal;
	};

	MyModal.$inject = ['$rootScope', '$timeout'];
	angular.module('appModule').factory('MyModal', MyModal);

})();
(function() {

	'use strict';

	var MySrc = function($rootScope, $q, $timeout, MyLoader) {

		var MySrc = function(conf) {

			if (conf) {

				this.defaultUrl = conf.defaultUrl;
				this.constructUrl = conf.constructUrl;
				this.uploadRequest = conf.uploadRequest;
				this.removeRequest = conf.removeRequest;
			}

			this.loader = new MyLoader(250);
		};

		MySrc.prototype.load = function(url, force, cb) {

			var that = this;

			// When no url supplied but construct url method found
			if (!url && that.constructUrl) { url = that.constructUrl(that.index); }

			// When forcing file load
			if (force) { that.url = undefined; }



			// Loading
			if (url != that.url) {

				that.loader.start();
				that.deferred = $q.defer();

				// Load promise cb
				that.deferred.promise.then(function(success) {

					if (!success) {

						if (that.defaultUrl) {
							that.url = that.defaultUrl;
						}
					}

					that.loader.stop();
					if (cb) { cb(success); }
				});

				// Settings new url
				$timeout(function() { that.url = url; }, that.loader.minLoadTime);

				return that.deferred.promise;
			}
		};

		MySrc.prototype.loadSecondary = function() {

			if (this.defaultUrl) {
				this.load(this.defaultUrl);
			}
		};

		MySrc.prototype.isDefaultUrlLoaded = function() {

			if (this.defaultUrl) {
				return this.url == this.defaultUrl;
			}
		};

		MySrc.prototype.update = function(args, i) {

			var that = this;

			return $q(function(resolve) {

				that.loader.start(false, function() {

					// Running external procedure
					that.uploadRequest(args, i).then(function(res) {

						if (res.success) {

							if (args.doReload) {

								that.load(that.url, true, function() {
									resolve(res.success);
								});

							} else if (args.getReloadUrl) {

								that.load(args.getReloadUrl(i), true, function() {
									resolve(res.success);
								});

							} else { resolve(res.success); }

						} else {

							that.loader.stop();
							resolve(res.success);
						}
					});
				});
			});
		};

		MySrc.prototype.remove = function(args, doLoadSecondary) {

			var that = this;
			if (!args) { args = {}; }

			return $q(function(resolve) {

				var finish = function(success) {

					if (success) {
						if (doLoadSecondary) {
							that.loadSecondary();
						}

					} else {
						that.loader.stop();
					}

					resolve(success);
				};

				that.loader.start(false, function() {

					if (that.removeRequest) {

						// Running external procedure
						that.removeRequest(args).then(function(success) { finish(success); });

					} else { finish(true); }
				});
			});
		};

		return MySrc;
	};

	MySrc.$inject = ['$rootScope', '$q', '$timeout', 'MyLoader'];
	angular.module('appModule').factory('MySrc', MySrc);

})();
(function() {

	'use strict';

	var MySrcAction = function($rootScope, $q, UsersRest) {

		var MySrcAction = function(config) {

			if (config) {
				this.acceptedFiles = config.acceptedFiles;
				this.maxFiles = config.maxFiles;
				this.maxFileSize = config.maxFileSize;
				this.getFilesCount = config.getFilesCount;
			}
		};

		MySrcAction.prototype.validate = function(actionId, data) {

			var that = this;

			switch(actionId) {

				case 'updateSingle':

					return $q(function(resolve) {

						var validFileTypes = that.getValidFileTypes();

						// Checking if number of files to upload is proper
						if (data.length == 1) {

							// Validating file extension
							if (validFileTypes.indexOf(data[0].type) == -1) {
								resolve({ success: false, msgId: 'WRONG_FILE_TYPE' });
								return;
							}

							// Validating file size
							if (data[0].size > that.maxFileSize) {
								resolve({ success: false, msgId: 'FILE_TOO_LARGE' });
								return;
							}

							resolve({ success: true });

						} else { resolve({ success: false, msgId: 'UPLOADING_TOO_MANY_FILES' }); }
					});

				case 'addToSet':

					return $q(function(resolve) {

						// When any file chosen
						if (data && data.length > 0) {

							var uniqueInputFiles = _.uniqBy(data, 'name');

							// When no duplicates
							if (uniqueInputFiles.length == data.length) {

								var filesCount = that.getFilesCount();

								// When there is room for more files
								if (filesCount < that.maxFiles) {

									var maxToUpload = that.maxFiles - filesCount;

									// Checking if number of files to upload is proper
									if (data.length <= maxToUpload) {

										var validFileTypes = that.getValidFileTypes();

										// For each input file
										for (var i = 0; i < data.length; i++) {

											// Validating file extension
											if (validFileTypes.indexOf(data[i].type) == -1) {
												resolve({ success: false, msgId: 'WRONG_FILE_TYPE' });
												return;
											}

											// Validating file size
											if (data[i].size > that.maxFileSize) {
												resolve({ success: false, msgId: 'FILE_TOO_LARGE' });
												return;
											}
										}

										resolve({ success: true });

									} else { resolve({ success: false, msgId: 'UPLOADING_TOO_MANY_FILES' }); }

								} else { resolve({ success: false, msgId: 'MAX_FILES_UPLOADED' }); }

							} else { resolve({ success: false, msgId: 'INPUT_FILES_CONSISTS_OF_DUPLICATES' }); }

						} else { resolve({ success: false, msgId: 'NO_FILES_LOADED' }); }
					});

				case 'delete':

					return $q(function(resolve) { resolve({ success: true }); });

				default:

					return $q(function(resolve) { resolve({ success: false }); });
			}
		};

		MySrcAction.prototype.getValidFileTypes = function() {

			return this.acceptedFiles.split(',');
		};

		MySrcAction.prototype.displayModalMessage = function(msgId, acceptCb) {

			var username = $rootScope.apiData.loggedInUser.username;

			var settings;

			switch (msgId) {

				case 'confirmDeletion':
					settings = { title: $rootScope.hardData.labels[28], acceptCb: acceptCb };
					$rootScope.ui.modals.confirmProceedModal.show(settings);
					break;

				case 'MAX_FILES_UPLOADED':
					settings = { title: username, message: $rootScope.hardData.rejections[4] };
					$rootScope.ui.modals.infoModal.show(settings);
					break;

				case 'UPLOADING_TOO_MANY_FILES':
					settings = { title: username, message: $rootScope.hardData.rejections[5] };
					$rootScope.ui.modals.infoModal.show(settings);
					break;

				case 'filenameAlreadyExists':
					settings = { title: username, message: $rootScope.hardData.rejections[6] };
					$rootScope.ui.modals.infoModal.show(settings);
					break;

				case 'WRONG_FILE_TYPE':
					settings = { title: username, message: $rootScope.hardData.rejections[2] };
					$rootScope.ui.modals.infoModal.show(settings);
					break;

				case 'FILE_TOO_LARGE':
					settings = { title: username, message: $rootScope.hardData.rejections[3] + this.maxFileSize / 1024 / 1024 + ' Mb.' };
					$rootScope.ui.modals.infoModal.show(settings);
					break;
			}
		};

		MySrcAction.createFormDataObject = function(args, file) {

			var formData = new FormData();
			angular.forEach(args, function(value, key) { formData.append(key, value); });
			formData.append('file', file);

			return formData;
		};

		return MySrcAction;
	};

	MySrcAction.$inject = ['$rootScope', '$q', 'UsersRest'];
	angular.module('appModule').factory('MySrcAction', MySrcAction);

})();
(function() {

	'use strict';

	var MySrcCollection = function($rootScope, $q, MyCollectionSelector, MySrc, MyLoader) {

		var MySrcCollection = function(conf) {

			Object.assign(MySrcCollection.prototype, MyCollectionSelector.prototype);

			if (conf) {

				this.srcArgs = {
					defaultUrl: conf.defaultUrl,
					constructUrl: conf.constructUrl,
					uploadRequest: conf.uploadRequest,
					removeRequest: conf.removeRequest
				};
			}

			this.collection = [];
			this.loader = new MyLoader(250);
		};

		MySrcCollection.prototype.init = function(collection, cb, args) {

			var that = this;

			that.loader.start(false, function() {

				// When there is some init data
				if (collection.length > 0) {

					// Emptying collection array
					that.collection.length = 0;

					var loadPromises = [];

					// For all elem in collection
					for (var i in collection) {

						// Creating src
						var src = new MySrc(that.srcArgs);
						src.index = Number(i);

						// Assigning collection elem fields to newly created src
						Object.assign(src, collection[i]);

						// Pushing to an array
						that.collection.push(src);

						// Loading
						if (!args || !args.doNotLoad) {
							loadPromises.push(that.collection[i].load(src.constructUrl(i)));
						}
					}

					if (!args || !args.doNotLoad) {

						// Returning all loading finished promises
						$q.all(loadPromises).then(function(results) {

							that.loader.stop();
							if (cb) { cb(results); }
						});

					} else {

						that.loader.stop();
						if (cb) { cb(); }
					}

				} else {

					// Emptying collection array
					that.collection.length = 0;

					that.loader.stop();
					if (cb) { cb(); }
				}
			});
		};

		MySrcCollection.prototype.updateSingle = function(args, cb) {

			var that = this;

			// Creating new src
			var newSrc = new MySrc(that.srcArgs);
			newSrc.index = args.src.index;

			// Replacing in new array
			that.collection[newSrc.index] = newSrc;

			// Updating
			newSrc.update(args, 0).then(function(success) {

				// If error while updating
				if (!success) {

					// Setting new src back to old one
					that.collection[args.src.index] = args.src;

					// Showing modal
					$rootScope.ui.modals.tryAgainLaterModal.show();
				}

				if (cb) { cb(success); }
			});
		};

		MySrcCollection.prototype.addToSet = function(args, cb) {

			var that = this;
			var updatePromises = [];

			// Getting current collection count
			var count = that.collection.length;

			// For all input files
			for (var i in args.inputData) {

				// If inputData element is of File class
				if (args.inputData[i] instanceof File) {

					// Creating src
					var src = new MySrc(that.srcArgs);
					src.index = Number(i) + count;
					that.collection.push(src);

					// Updating src
					updatePromises.push(src.update(args, i));
				}
			}

			// When all updates done
			$q.all(updatePromises).then(function(results) {

				// For all results backwards
				for (var i = results.length - 1; i >= 0; i--) {

					// If unsuccessfull update
					if (!results[i]) {

						// Removing src from array
						that.collection.splice(Number(i) + count, 1);
					}
				}

				if (results.length > that.collection.length) {
					that.resetIndexes();
				}

				if (cb) { cb(results); }
			});
		};

		MySrcCollection.prototype.removeFromSet = function(args, cb) {

			var that = this;

			if (args.collection.length === 0) {

				// Showing info modal
				$rootScope.ui.modals.infoModal.show({
					title: $rootScope.apiData.loggedInUser.username,
					message: $rootScope.hardData.rejections[8],
					hideCb: function() { cb(false); }
				});

			} else {

				// Showing confirmation modal
				$rootScope.ui.modals.confirmProceedModal.show({
					title: $rootScope.hardData.labels[28] + ' (' + args.collection.length + ')',
					acceptCb: function() {

						var promises = [];

						for (var i = 0; i < args.collection.length; i++) {
							promises.push(args.collection[i].remove());
						}

						$q.all(promises).then(function(results) {

							// For all results backwards
							for (var i = results.length - 1; i >= 0; i--) {

								// If successfull delete
								if (results[i]) {

									// Removing src from array
									that.collection.splice(args.collection[i].index, 1);
								}
							}

							that.resetIndexes();
							cb(results);
						});
					},
					dismissCb: function() {

						if (cb) { cb(); }
					}
				});
			}
		};

		MySrcCollection.prototype.moveSingle = function(direction, src, cb) {

			var that = this;

			if (that.collection.length > 1) {

				src = that.collection.splice(src.index, 1)[0];

				switch (direction) {

					case 'moveLeft':

						if (src.index > 0) {
							that.collection.splice(src.index - 1, 0, src);

						} else {
							that.collection.splice(that.collection.length, 0, src);
						}

						break;

					case 'moveRight':

						if (src.index < that.collection.length) {
							that.collection.splice(src.index + 1, 0, src);

						} else {
							that.collection.splice(0, 0, src);
						}

						break;
				}

				that.resetIndexes();

				if (cb) { cb(); }
			}
		};

		MySrcCollection.prototype.resetIndexes = function() {

			for (var i in this.collection) {
				this.collection[i].index = Number(i);
			}
		};

		return MySrcCollection;
	};

	MySrcCollection.$inject = ['$rootScope', '$q', 'MyCollectionSelector', 'MySrc', 'MyLoader'];
	angular.module('appModule').factory('MySrcCollection', MySrcCollection);

})();
(function() {

	'use strict';

	var MyStorageItem = function(localStorageService) {

		var MyStorageItem = function(config) {

			this._id = config._id;
			this.type = config.type;
			if (angular.isDefined(config.daysToExpire)) { this.daysToExpire = config.daysToExpire; }
		};



		MyStorageItem.prototype.getValue = function() {

			switch (this.type) {

				case 'cookie':
					return localStorageService.cookie.get(this._id);

				case 'localStorageItem':
					return localStorageService.get(this._id);
			}
		};

		MyStorageItem.prototype.setValue = function(newValue) {

			switch (this.type) {

				case 'cookie':
					localStorageService.cookie.set(this._id, newValue, this.daysToExpire);
					break;

				case 'localStorageItem':
					localStorageService.set(this._id, newValue);
					break;
			}
		};

		MyStorageItem.prototype.remove = function() {

			switch (this.type) {

				case 'cookie':
					localStorageService.cookie.remove(this._id);
					break;

				case 'localStorageItem':
					localStorageService.remove(this._id);
					break;
			}
		};



		return MyStorageItem;
	};



	MyStorageItem.$inject = ['localStorageService'];
	angular.module('appModule').factory('MyStorageItem', MyStorageItem);

})();
(function() {

	'use strict';

	var MySwitchable = function(MySwitcher, jsonService, hardDataService) {

		var MySwitchable = function(config) {

			Object.assign(this, $.extend(true, {}, config));
			this.instantiateSwitchers();
		};



		MySwitchable.prototype.instantiateSwitchers = function(switchers, cb) {

			var that = this;
			if (switchers) { that.switchers = switchers; }

			if (that.switchers) {

				that.switcherIds = [];

				angular.forEach(that.switchers, function(switcher, key) {

					if (typeof(switcher) == 'object') {
						that.switchers[key] = new MySwitcher(switcher, that);
						that.switcherIds.push(switcher._id);
					}
				});

				that.activeSwitcherId = that.switcherIds[0];
			}

			if (cb) { cb(); }
		};

		MySwitchable.prototype.activateSwitcher = function(switcherId) {

			var index;

			switch(switcherId) {

				case 'prev':

					index = this.getActiveSwitcherIndex();
					if (index > 0) { this.switchers[index - 1].activate(); } else { this.switchers[this.switchers.length - 1].activate(); }
					break;

				case 'next':

					index = this.getActiveSwitcherIndex();
					if (index < this.switchers.length - 1) { this.switchers[index + 1].activate(); } else { this.switchers[0].activate(); }
					break;

				default:

					var switcher = this.getSwitcher('_id', switcherId);
					if (switcher) { switcher.activate(); } else { this.activeSwitcherId = undefined; }
					break;
			}
		};

		MySwitchable.prototype.getSwitcher = function(key, value) {

			var that = this;

			if (that.switchers) {

				return _.find(that.switchers, function(switcher) {
					return switcher[key] == value;
				});

			} else { return null; }
		};

		MySwitchable.prototype.getActiveSwitcher = function() {

			var that = this;

			return _.find(that.switchers, function(switcher) {
				return switcher._id == that.activeSwitcherId;
			});
		};

		MySwitchable.prototype.getActiveSwitcherIndex = function () {

			var activeSwitcher = this.getActiveSwitcher();

			for (var i = 0; i < this.switchers.length; i++) {
				if (this.switchers[i]._id == activeSwitcher._id) {
					return i;
				}
			}

			return -1;
		};

		MySwitchable.prototype.getFirstSwitcher = function() {

			return _.head(this.switchers);
		};

		return MySwitchable;
	};

	MySwitchable.$inject = ['MySwitcher', 'jsonService', 'hardDataService'];
	angular.module('appModule').factory('MySwitchable', MySwitchable);

})();
(function() {

	'use strict';

	var MySwitcher = function() {

		var MySwitcher = function(config, parent) {

			Object.assign(this, config);
			this.parent = parent;
		};



		MySwitcher.prototype.activate = function(args) {

			this.parent.activeSwitcherId = this._id;
			if (this.onActivate) { this.onActivate(args); }
		};



		return MySwitcher;
	};



	MySwitcher.$inject = [];
	angular.module('appModule').factory('MySwitcher', MySwitcher);

})();
(function() {

	'use strict';

	var AppConfigsRest = function(Restangular, MyDataModel) {

		var appConfigs = Restangular.service('app_configs');

		appConfigs.appConfigModel = new MyDataModel({
			language: {},
			theme: {}
		});

		return appConfigs;
	};

	AppConfigsRest.$inject = ['Restangular', 'MyDataModel'];
	angular.module('appModule').factory('AppConfigsRest', AppConfigsRest);

})();
(function() {

	'use strict';

	var CommentsRest = function(Restangular, MyDataModel) {

		var comments = Restangular.service('comments');
		return comments;
	};

	CommentsRest.$inject = ['Restangular', 'MyDataModel'];
	angular.module('appModule').factory('CommentsRest', CommentsRest);

})();
(function() {

	'use strict';

	var ContactTypesRest = function(Restangular, MyDataModel) {

		var contactTypes = Restangular.service('contact_types');

		contactTypes.contactTypeModel = new MyDataModel({
			contactType: {},
			contactMsg: {}
		});

		return contactTypes;
	};

	ContactTypesRest.$inject = ['Restangular', 'MyDataModel'];
	angular.module('appModule').factory('ContactTypesRest', ContactTypesRest);

})();
(function() {

	'use strict';

	var DeactivationReasonsRest = function(Restangular, MyDataModel) {

		var deactivationReasons = Restangular.service('deactivation_reasons')

		deactivationReasons.deactivationReasonModel = new MyDataModel({
			deactivationReasonId: {}
		});

		return deactivationReasons;
	};

	DeactivationReasonsRest.$inject = ['Restangular', 'MyDataModel'];
	angular.module('appModule').factory('DeactivationReasonsRest', DeactivationReasonsRest);

})();
(function() {

	'use strict';

	var PaymentsRest = function(Restangular, MyDataModel) {

		var payments = Restangular.service('payments');

		payments.paymentModel = new MyDataModel({
			paymentMethod: {},
			creditCardType: {},
			creditCardNumber: {},
			creditCardExpireMonth: {},
			creditCardExpireYear: {},
			cvv2: {},
			firstname: {},
			lastname: {},
			amount: {},
			currency: {}
		});

		return payments;
	};

	PaymentsRest.$inject = ['Restangular', 'MyDataModel'];
	angular.module('appModule').factory('PaymentsRest', PaymentsRest);

})();
(function() {

	'use strict';

	var UsersRest = function($rootScope, Restangular, MyDataModel) {

		var users = Restangular.service('users');

		users.loginModel = new MyDataModel({
			username: {},
			password: {}
		});

		users.registerModel = new MyDataModel({
			email: {},
			username: {},
			password: {},
			firstname: {},
			lastname: {},
			countryFirstLetter: {},
			country: {}
		});

		users.recoverModel = new MyDataModel({
			email: {}
		});

		users.personalDetailsModel = new MyDataModel({
			email: {},
			firstname: {},
			lastname: {},
			countryFirstLetter: {},
			country: {}
		});

		users.passwordModel = new MyDataModel({
			currentPassword: {},
			password: {}
		});

		Restangular.extendModel('users', function(user) {

			user._isTheOneLoggedIn = function() {

				if ($rootScope.apiData.loggedInUser) {
					return user._id == $rootScope.apiData.loggedInUser._id;
				}
			};

			return user;
		});

		return users;
	};

	UsersRest.$inject = ['$rootScope', 'Restangular', 'MyDataModel'];
	angular.module('appModule').factory('UsersRest', UsersRest);

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('reports', function($rootScope, $moment, reportsConf, reportsService, contextMenuConf) {

		var reports = {
			restrict: 'E',
			templateUrl: 'public/directives/app/collection/reports/reports.html',
			scope: {
				ctrlId: '@',
				noAvatar: '=',
				noInfo: '='
			},
			controller: function($scope) {

				$scope.hardData = $rootScope.hardData;
				$scope.apiData = $rootScope.apiData;
				$scope.$moment = $moment;

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
									scope.collectionBrowser = reportsConf.searchReports;
									scope.collectionBrowser.init();
								});
							}

							scope.$on('$destroy', function() {
								$rootScope.$$listeners.initSearchReports = null;
							});

							scope.collectionBrowser = reportsConf.searchReports;
							scope.collectionBrowser.init();
							break;

						case 'RecentlyViewedReports':

							if (!$rootScope.$$listeners.initRecentlyViewedReports) {
								$rootScope.$on('initRecentlyViewedReports', function(e, args) {
									scope.collectionBrowser = reportsConf.viewedReports;
									scope.collectionBrowser.init();
								});
							}

							scope.$on('$destroy', function() {
								$rootScope.$$listeners.initRecentlyViewedReports = null;
							});

							scope.collectionBrowser = reportsConf.viewedReports;
							scope.collectionBrowser.init();
							break;

						case 'NewReports':

							scope.collectionBrowser = reportsConf.recentReports;
							scope.collectionBrowser.init();
							break;
					}
				};
			}
		};

		return reports;
	});

})();
(function() {

	'use strict';

	var reportsConf = function($rootScope, hardDataService, myClass, ReportsRest) {

		var hardData = hardDataService.get();

		this.searchReports = new myClass.MyCollectionBrowser({
			singlePageSize: 25,
			filterer: {
				switchers: [
					{
						_id: 'all',
						label: hardData.status[1]
					},
					{
						_id: 'lost',
						label: hardData.reportTypes[0].label2
					},
					{
						_id: 'found',
						label: hardData.reportTypes[1].label2
					}
				]
			},
			sorter: {
				switchers: [
					{
						_id: 'title',
						label: hardData.status[7]
					},
					{
						_id: 'date',
						label: hardData.status[8]
					}
				]
			},
			fetchData: function(query) {

				query.subject = 'searchReports';

				var model = ReportsRest.reportSearchModel.getValues();
				Object.assign(query, model);

				return ReportsRest.getList(query);
			}
		});

		this.userReports = new myClass.MyCollectionBrowser({
			singlePageSize: 25,
			filterer: {
				switchers: [
					{
						_id: 'all',
						label: hardData.status[1]
					},
					{
						_id: 'lost',
						label: hardData.reportTypes[0].label2
					},
					{
						_id: 'found',
						label: hardData.reportTypes[1].label2
					}
				]
			},
			sorter: {
				switchers: [
					{
						_id: 'title',
						label: hardData.status[7]
					},
					{
						_id: 'date',
						label: hardData.status[8]
					}
				]
			},
			fetchData: function(query) {

				query.subject = 'userReports';
				query.userId = $rootScope.apiData.profileUser._id;
				return ReportsRest.getList(query);
			}
		});

		this.recentReports = new myClass.MyCollectionBrowser({
			singlePageSize: 5,
			noPager: true,
			fetchData: function(query) {

				query.subject = 'recentReports';
				query.sort='-dateAdded';
				query.limit = 5;

				return ReportsRest.getList(query);
			}
		});

		this.viewedReports = new myClass.MyCollectionBrowser({
			singlePageSize: 5,
			hideRefresher: true,
			fetchData: function(query) {

				query.subject = 'viewedReports';
				query.limit = 5;

				return ReportsRest.getList(query);
			}
		});

		return this;
	};

	reportsConf.$inject = ['$rootScope', 'hardDataService', 'myClass', 'ReportsRest'];
	angular.module('appModule').service('reportsConf', reportsConf);

})();
(function() {

	'use strict';

	var ReportsRest = function($rootScope, Restangular, MyDataModel) {

		var getReportEventModelConf = function() {
			return {
				type: {},
				date: {},
				placeId: {},
				address: {},
				lat: {},
				lng: {},
				details: {}
			};
		};

		var getReportModelConf = function() {
			return {
				category1: {},
				category2: {},
				category3: {},
				title: {},
				serialNo: {},
				description: {},
				startEvent: getReportEventModelConf()
			};
		};

		var reports = Restangular.service('reports');

		reports.addReportModel = new MyDataModel(getReportModelConf());
		reports.editReportModel = new MyDataModel(getReportModelConf());
		reports.respondToReportModel = new MyDataModel(getReportEventModelConf());

		reports.reportSearchModel = new MyDataModel({
			title: {},
			category1: {},
			category2: {},
			category3: {}
		});

		Restangular.extendModel('reports', function(report) {

			report._isOwn = function() {

				if ($rootScope.apiData.loggedInUser) {
					return this.userId == $rootScope.apiData.loggedInUser._id;
				}
			};

			report.getFullCategory = function() {

				var category1, category2, category3;
				var labels = [];

				if (report.category1) {

					category1 = _.find($rootScope.hardData.reportCategories, function(obj) {
						return obj._id == report.category1;
					});

					labels.push(category1.label);
				}

				if (report.category2) {

					category2 = _.find(category1.subcategories, function(obj) {
						return obj._id == report.category2;
					});

					labels.push(category2.label);
				}

				if (report.category3) {

					category3 = _.find(category2.subcategories, function(obj) {
						return obj._id == report.category3;
					});

					labels.push(category3.label);
				}

				return labels.join(' / ');
			};

			return report;
		});

		return reports;
	};

	ReportsRest.$inject = ['$rootScope', 'Restangular', 'MyDataModel'];
	angular.module('appModule').factory('ReportsRest', ReportsRest);

})();
(function() {

	'use strict';

	var reportsService = function($rootScope, $state, $stateParams, $timeout, $q, reportsConf) {

		var service = this;

		service.deleteReports = function(reports) {

			if (reports && reports.length > 0) {

				// Showing confirm modal
				$rootScope.ui.modals.deleteReportModal.show({
					title: $rootScope.ui.modals.deleteReportModal.title + ' (' + reports.length + ')',
					message: $rootScope.hardData.warnings[2],
					acceptCb: function() {

						var promises = [];
						for (var report of reports) { promises.push(report.remove()); }

						$q.all(promises).then(function(results) {

							switch ($state.current.name) {

								case 'app.profile':
									$rootScope.$broadcast('initUserReports', { userId: $stateParams.id });
									break;

								case 'app.report':
									$state.go('app.profile', { _id: $rootScope.apiData.loggedInUser._id }, { location: 'replace' });
									$timeout(function() { $rootScope.$broadcast('initUserReports', { userId: $stateParams.id }); });
									break;
							}
						});
					}
				});
			}
		};

		service.initUserReports = function(scope, userId) {

			scope.collectionBrowser = reportsConf.userReports;

			if (userId == $rootScope.apiData.loggedInUser._id) {
				scope.elemContextMenuConf = scope.reportContextMenuConf;

			} else {
				scope.elemContextMenuConf = undefined;
			}

			scope.collectionBrowser.onRefreshClick();
		};

		return service;
	};



	reportsService.$inject = ['$rootScope', '$state', '$stateParams', '$timeout', '$q', 'reportsConf'];
	angular.module('appModule').service('reportsService', reportsService);

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('appearanceForm', function($rootScope, MyForm, AppConfigsRest, Restangular) {

		var appearanceForm = {
			restrict: 'E',
			templateUrl: 'public/directives/app/form/appearanceForm/appearanceForm.html',
			scope: true,
			controller: function($scope) {

				$scope.myForm = new MyForm({
					ctrlId: 'appearanceForm',
					model: AppConfigsRest.appConfigModel,
					reload: true,
					submitAction: function(args) {

						var copy = Restangular.copy($rootScope.apiData.appConfig);
						AppConfigsRest.appConfigModel.assignTo(copy);
						return copy.put();
					}
				});
			}
		};

		return appearanceForm;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('contactForm', function($rootScope, myClass, ContactTypesRest) {

		var contactForm = {
			restrict: 'E',
			templateUrl: 'public/directives/app/form/contactForm/contactForm.html',
			scope: true,
			controller: function($scope) {

				$scope.myForm = new myClass.MyForm({
					ctrlId: 'contactForm',
					model: ContactTypesRest.contactTypeModel,
					submitAction: function(args) {

						return ContactTypesRest.post(ContactTypesRest.contactTypeModel.getValues());
					},
					submitSuccessCb: function(res) {

						ContactTypesRest.contactTypeModel.reset(true, true);
					}
				});
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					scope.$watch(function() { return $rootScope.apiData.contactTypes; }, function(newValue) {
						scope.contactTypes = newValue;
					});
				};
			}
		};

		return contactForm;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('deactivationForm', function($rootScope, ui, myClass, DeactivationReasonsRest) {

		var deactivationForm = {
			restrict: 'E',
			templateUrl: 'public/directives/app/form/deactivationForm/deactivationForm.html',
			scope: true,
			controller: function($scope) {

				$scope.myForm = new myClass.MyForm({
					ctrlId: 'deactivationForm',
					model: DeactivationReasonsRest.deactivationReasonModel,
					submitAction: function(args, cb) {

						return $rootScope.apiData.loggedInUser.remove(DeactivationReasonsRest.deactivationReasonModel.getValues());
					},
					submitSuccessCb: function(res) {

						$rootScope.logout({ action: 'deactivation' });
					}
				});

				$scope.onDeactivateClick = function() {

					if ($scope.myForm.model.getValue('deactivationReasonId')) {

						$rootScope.ui.modals.confirmDeactivationModal1.show({
							acceptCb: function() {

								$rootScope.ui.modals.confirmDeactivationModal2.show({
									acceptCb: function() {
										$scope.myForm.submit();
									}
								});
							}
						});
					}
				};
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					scope.$watch(function() { return $rootScope.apiData.deactivationReasons; }, function(newValue) {
						scope.deactivationReasons = newValue;
					});
				};
			}
		};

		return deactivationForm;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('formActionBtns', function() {

		var formActionBtns = {
			restrict: 'E',
			templateUrl: 'public/directives/app/form/formActionBtns/formActionBtns.html',
			transclude: true,
			scope: {
				myForm: '='
			},
			controller: function($scope) {

				var clearBtnForms = [
					'loginForm', 'registerForm', 'recoverForm', 'passwordForm', 'deactivationForm', 'reportSearchForm',
					'contactForm', 'editReportForm', 'commentsForm', 'commentsReplyForm'
				];

				var resetBtnForms = ['regionalForm', 'appearanceForm', 'personalDetailsForm', 'editReportForm', 'addReportForm', 'upgradeForm', 'respondToReportForm'];

				var cancelBtnForms = ['editReportForm', 'addReportForm', 'respondToReportForm'];

				$scope.myForm.showClearBtn = clearBtnForms.indexOf($scope.myForm.ctrlId) > -1;
				$scope.myForm.showResetBtn = resetBtnForms.indexOf($scope.myForm.ctrlId) > -1;
				$scope.myForm.showCancelBtn = cancelBtnForms.indexOf($scope.myForm.ctrlId) > -1;

				switch ($scope.myForm.ctrlId) {

					case 'addReportForm':
					case 'editReportForm':
					case 'respondToReportForm':
						$scope.myForm.submitBtnPhraseIndex = 4;
						break;

					case 'loginForm':
					case 'registerForm':
					case 'recoverForm':
						$scope.myForm.submitBtnPhraseIndex = 3;
						break;

					case 'contactForm':
					case 'commentsForm':
					case 'commentsReplyForm':
						$scope.myForm.submitBtnPhraseIndex = 4;
						break;

					case 'regionalForm':
					case 'appearanceForm':
					case 'personalDetailsForm':
					case 'passwordForm':
						$scope.myForm.submitBtnPhraseIndex = 5;
						break;

					case 'reportSearchForm':
						$scope.myForm.submitBtnPhraseIndex = 17;
						break;

					case 'upgradeForm':
						$scope.myForm.submitBtnPhraseIndex = 36;
						break;
				}



				$scope.onSubmit = function() { $scope.myForm.submit(); };
				$scope.onClear = function() { $scope.myForm.clear(); };
				$scope.onReset = function() { $scope.myForm.reset(); };
				$scope.onCancel = function() { $scope.myForm.onCancel(); };
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {


				};
			}
		};

		return formActionBtns;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('loginForm', function($timeout, $state, authService, MyForm, UsersRest) {

		var loginForm = {
			restrict: 'E',
			templateUrl: 'public/directives/app/form/loginForm/loginForm.html',
			scope: true,
			controller: function($scope) {

				$scope.myForm = new MyForm({
					ctrlId: 'loginForm',
					model: UsersRest.loginModel,
					submitAction: function(args) {

						var body = UsersRest.loginModel.getValues();
						return UsersRest.post(body, { action: 'login' }, { captcha_response: args.captchaResponse });
					},
					submitSuccessCb: function(res) {

						authService.setAsLoggedIn(function() {
							$timeout(function() {
								$state.go('app.start', { tab: 'status' });
							});
						});
					},
					submitErrorCb: function(res) {

						authService.setAsLoggedOut();
					}
				});
			}
		};

		return loginForm;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('passwordForm', function($rootScope, MyForm, UsersRest, Restangular) {

		var passwordForm = {
			restrict: 'E',
			templateUrl: 'public/directives/app/form/passwordForm/passwordForm.html',
			scope: true,
			controller: function($scope) {

				$scope.myForm = new MyForm({
					ctrlId: 'passwordForm',
					model: UsersRest.passwordModel,
					submitAction: function(args) {

						return UsersRest.post(UsersRest.passwordModel.getValues(), { action: 'updatePass' });
					},
					submitSuccessCb: function(res) {

						UsersRest.passwordModel.reset(true, true);
					}
				});
			}
		};

		return passwordForm;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('personalDetailsForm', function($rootScope, MyForm, UsersRest, Restangular) {

		var personalDetailsForm = {
			restrict: 'E',
			templateUrl: 'public/directives/app/form/personalDetailsForm/personalDetailsForm.html',
			scope: true,
			controller: function($scope) {

				$scope.countries = $rootScope.localData.countries;

				$scope.myForm = new MyForm({
					ctrlId: 'personalDetailsForm',
					model: UsersRest.personalDetailsModel,
					submitAction: function(args) {

						var copy = Restangular.copy($rootScope.apiData.loggedInUser);
						$scope.myForm.model.assignTo(copy);
						return copy.put();
					},
					submitSuccessCb: function(res) {

						var user = $rootScope.apiData.loggedInUser;
						var updated = res.config.data;

						user.email = updated.email;
						user.firstname = updated.firstname;
						user.lastname = updated.lastname;
						user.country = updated.country;
						user.photos = updated.photos;
					}
				});
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {};
			}
		};

		return personalDetailsForm;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('recoverForm', function($rootScope, $http, MyForm, UsersRest) {

		var recoverForm = {
			restrict: 'E',
			templateUrl: 'public/directives/app/form/recoverForm/recoverForm.html',
			scope: true,
			controller: function($scope) {

				$scope.myForm = new MyForm({
					ctrlId: 'recoverForm',
					model: UsersRest.recoverModel,
					submitAction: function(args) {

						var body = UsersRest.recoverModel.getValues();
						return $http.post('/recover', body, { headers: { captcha_response: args.captchaResponse } });
					},
					submitSuccessCb: function(res) {

						$rootScope.ui.modals.infoModal.show({
							title: res.data.msg.title,
							message: res.data.msg.info
						});
					}
				});
			}
		};

		return recoverForm;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('regionalForm', function($rootScope, MyForm, AppConfigsRest, Restangular) {

		var regionalForm = {
			restrict: 'E',
			templateUrl: 'public/directives/app/form/regionalForm/regionalForm.html',
			scope: true,
			controller: function($scope) {

				$scope.myForm = new MyForm({
					ctrlId: 'regionalForm',
					model: AppConfigsRest.appConfigModel,
					reload: true,
					submitAction: function(args) {

						var copy = Restangular.copy($rootScope.apiData.appConfig);
						AppConfigsRest.appConfigModel.assignTo(copy);
						return copy.put();
					}
				});
			}
		};

		return regionalForm;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('registerForm', function($rootScope, $timeout, $state, authService, MyForm, UsersRest) {

		var registerForm = {
			restrict: 'E',
			templateUrl: 'public/directives/app/form/registerForm/registerForm.html',
			scope: true,
			controller: function($scope) {

				$scope.countries = $rootScope.localData.countries;

				$scope.myForm = new MyForm({
					ctrlId: 'registerForm',
					model: UsersRest.registerModel,
					submitAction: function(args) {

						var body = UsersRest.registerModel.getValues();
						return UsersRest.post(body, { action: 'register' }, { captcha_response: args.captchaResponse });
					},
					submitSuccessCb: function(res) {

						UsersRest.registerModel.reset(true, true);

						authService.setAsLoggedIn(function() {
							$timeout(function() {
								$state.go('app.start', { tab: 'status' });
							});
						});
					},
					submitErrorCb: function(res) {

						authService.setAsLoggedOut();
					}
				});
			}
		};

		return registerForm;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('reportForm', function($rootScope, $timeout, reportFormService, ReportsRest) {

		var reportForm = {
			restrict: 'E',
			templateUrl: 'public/directives/app/form/reportForm/reportForm.html',
			scope: {
				action: '@'
			},
			controller: function($scope) {

				$scope.ui = $rootScope.ui;
				$scope.apiData = $rootScope.apiData;
				$scope.hardData = $rootScope.hardData;

				$scope.autocomplete = {};
				$scope.minDate = new Date(2000, 0, 1);

				$scope.myForm = reportFormService.getForm($scope);
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					switch (scope.action) {

						case 'addReport':

							if (!$rootScope.$$listeners.onAddReportFormShow) {

								$rootScope.$on('onAddReportFormShow', function(e, args) {

									var date = reportFormService.getCurrentDateWithNoTime();
									ReportsRest.addReportModel.set({ startEvent: { date: date } }, true);
								});
							}

							$rootScope.$broadcast('onAddReportFormShow');

							break;

						case 'respondToReport':

							if (!$rootScope.$$listeners.onRespondToReportFormShow) {

								$rootScope.$on('onRespondToReportFormShow', function(e, args) {

									var date = reportFormService.getCurrentDateWithNoTime();
									ReportsRest.respondToReportModel.set({ date: date }, true);
								});
							}

							break;

						case 'editReport':

							if (!$rootScope.$$listeners.onEditReportFormShow) {

								$rootScope.$on('onEditReportFormShow', function(e, args) {

									ReportsRest.editReportModel.set($rootScope.apiData.report.plain(), true);
									$timeout(function() { scope.myForm.scope.loader.stop(); });
								});
							}

							break;
					}
				};
			}
		};

		return reportForm;
	});

})();
(function() {

	'use strict';

	var reportFormService = function($rootScope, $state, $timeout, ReportsRest, Restangular, MyForm) {

		var service = this;

		var getFormSubmitAction = function(scope) {

			switch (scope.action) {

				case 'addReport':

					return function(args) {

						scope.myForm.submitSuccessCb = function(res) {

							$state.go('app.report', { id: res.data._id });

							$timeout(function() {
								scope.myForm.reset();
								scope.myForm.scope.loader.stop();
							}, 500);
						};

						inspectAutoComplete(scope);
						var modelValues = scope.myForm.model.getValues();
						return ReportsRest.post(modelValues);
					};

				case 'editReport':

					return function(args) {

						scope.myForm.submitSuccessCb = function(res) {

							$rootScope.apiData.report = res.data;
							$state.go('app.report', { id: res.data._id, edit: undefined });
						};

						scope.myForm.submitErrorCb = function(res) {

							$rootScope.apiData.report = copy;
						};

						inspectAutoComplete(scope);
						var copy = Restangular.copy($rootScope.apiData.report);
						scope.myForm.model.assignTo(copy);
						return copy.put();
					};

				case 'respondToReport':

					return function(args) {


					};
			}
		};

		var inspectAutoComplete = function(scope) {

			var place = scope.autocomplete.ins.getPlace();
			var myForm = service[scope.action + 'Form'];

			if (place) {

				myForm.model.set({
					startEvent: {
						address: place.formatted_address,
						placeId: place.place_id,
						lat: place.geometry.location.lat(),
						lng: place.geometry.location.lng()
					}
				});

			} else {

				myForm.model.setValue('startEvent.address');
				myForm.model.setValue('startEvent.placeId');
				myForm.model.setValue('startEvent.lat');
				myForm.model.setValue('startEvent.lng');
			}
		};

		service.getCurrentDateWithNoTime = function() {

			// Setting max date to current date for all reportForm instances
			var date = new Date();
			return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
		};

		service.getForm = function(scope) {

			service[scope.action + 'Form'] = new MyForm({
				ctrlId: scope.action + 'Form',
				redirectOnSuccess: true,
				model: ReportsRest[scope.action + 'Model'],
				submitAction: getFormSubmitAction(scope),
				onCancel: function() {

					if (scope.action != 'respondToReport') {
						$timeout(function() { service[scope.action + 'Form'].reset(); });
						window.history.back();

					} else {
						$rootScope.$broadcast('toggleRespondToReportForm', { visible: false });
					}
				}
			});

			return service[scope.action + 'Form'];
		};

		return service;
	};

	reportFormService.$inject = ['$rootScope', '$state', '$timeout', 'ReportsRest', 'Restangular', 'MyForm'];
	angular.module('appModule').service('reportFormService', reportFormService);

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('reportSearchForm', function($rootScope, myClass, ReportsRest) {

		var reportSearchForm = {
			restrict: 'E',
			templateUrl: 'public/directives/app/form/reportSearchForm/reportSearchForm.html',
			scope: true,
			controller: function($scope) {

				$scope.reportCategories = $rootScope.hardData.reportCategories;

				$scope.myForm = new myClass.MyForm({
					ctrlId: 'reportSearchForm',
					noLoader: true,
					model: ReportsRest.reportSearchModel,
					submitAction: function(args) {

						$rootScope.$broadcast('initSearchReports');
					}
				});
			}
		};

		return reportSearchForm;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('upgradeForm', function($http, $window, hardDataService, exchangeRateService, PaymentsRest, myClass) {

		var DEFAULT_CURRENCY = 'USD';
		var DEFAULT_AMOUNT = '5.00';
		var CURRENT_YEAR = new Date().getFullYear();

		var upgradeForm = {
			restrict: 'E',
			templateUrl: 'public/directives/app/form/upgradeForm/upgradeForm.html',
			scope: {},
			controller: function($scope) {

				$scope.hardData = hardDataService.get();
				$scope.currentYear = CURRENT_YEAR;

				$scope.myModel = PaymentsRest.paymentModel;

				$scope.myModel.set({
					paymentMethod: 'credit_card',
					currency: DEFAULT_CURRENCY,
					amount: DEFAULT_AMOUNT,
					creditCardExpireMonth: 1,
					creditCardExpireYear: CURRENT_YEAR
				}, true);

				$scope.myForm = new myClass.MyForm({
					ctrlId: 'upgradeForm',
					redirectOnSuccess: true,
					model: $scope.myModel,
					submitAction: function(args) {

						if ($scope.myModel.getValue('paymentMethod') == 'credit_card') {
							return PaymentsRest.post($scope.myModel.getValues());

						} else {

							var body = {
								paymentMethod: $scope.myModel.getValue('paymentMethod'),
								amount: $scope.myModel.getValue('amount'),
								currency: $scope.myModel.getValue('currency')
							};

							return PaymentsRest.post(body);
						}
					},
					submitSuccessCb: function(res) {

						switch ($scope.myModel.getValue('paymentMethod')) {

							case 'credit_card':
								$window.location.reload();
								break;

							case 'paypal':
								$window.open(res.data.url, '_self');
								break;
						}
					},
					submitErrorCb: function(res) {


					}
				});
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					var amounts = {};
					amounts[DEFAULT_CURRENCY] = DEFAULT_AMOUNT;

					angular.forEach(scope.hardData.payment.currencies, function(obj) {
						if (obj.value != DEFAULT_CURRENCY) {
							var amount = exchangeRateService.methods.convert(DEFAULT_AMOUNT, DEFAULT_CURRENCY, obj.value);
							amounts[obj.value] = accounting.unformat(amount);
						}
					});

					scope.$watch('myModel.currency.value.active', function(newCurrency, oldCurrency) {

						if (newCurrency != oldCurrency) {
							scope.myModel.set({ 'amount': amounts[newCurrency] });
						}
					});
				};
			}
		};

		return upgradeForm;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('appStats', function($rootScope) {

		var appStats = {
			restrict: 'E',
			templateUrl: 'public/directives/app/other/appStats/appStats.html',
			scope: true,
			controller: function($scope) {

				$scope.hardData = $rootScope.hardData;
				$scope.apiData = $rootScope.apiData;
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

				};
			}
		};

		return appStats;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('userBadge', function($rootScope, $state, authService) {

		return {
			restrict: 'E',
			templateUrl: 'public/directives/app/other/userBadge/userBadge.html',
			scope: true,
			controller: function($scope) {

				$scope.authState = authService.state;
				$scope.label1 = $rootScope.hardData.status[0];

				$scope.onLogoutClick = function() {
					$rootScope.logout();
				};

				$scope.onContinueClick = function() {
					$state.go('app.home');
				};
			}
		};
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('reportAvatar', function(reportAvatarService, MySrc, URLS) {

		var reportAvatar = {
			restrict: 'E',
			templateUrl: 'public/directives/app/src/reportAvatar/reportAvatar.html',
			scope: {
				report: '=',
				noLink: '&',
				hideDefaultSrc: '='
			},
			controller: function($scope) {

				$scope.src = new MySrc({ defaultUrl: URLS.itemImg });
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					scope.$watch(function() {
						if (scope.report) { return scope.report.avatar; } else { return false; }

					}, function(avatar) {

						if (scope.report) {

							if (!scope.noLink()) { scope.src.href = '/#/report?id=' + scope.report._id; }

							var url = reportAvatarService.constructPhotoUrl(scope, true);
							if (!scope.hideDefaultSrc || url != scope.src.defaultUrl) { scope.src.load(url); }
						}
					});
				};
			}
		};

		return reportAvatar;
	});

})();
(function() {

	'use strict';

	var reportAvatarService = function(URLS) {

		var service = {
			constructPhotoUrl: function(scope, useThumb) {

				if (!scope.report.avatar) { return scope.src.defaultUrl; }

				if (!useThumb) {
					return URLS.AWS3_UPLOADS_BUCKET_URL + scope.report.userId + '/reports/' + scope.report._id + '/' + scope.report.avatar;

				} else {
					return URLS.AWS3_RESIZED_UPLOADS_BUCKET_URL + 'resized-' + scope.report.userId + '/reports/' + scope.report._id + '/' + scope.report.avatar;
				}
			}
		};

		return service;
	};

	reportAvatarService.$inject = ['URLS'];
	angular.module('appModule').service('reportAvatarService', reportAvatarService);

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('reportPhotos', function($rootScope, reportPhotosService, reportPhotosConf, MySrcCollection, MySrcAction, NUMS, URLS) {

		var reportPhotos = {
			restrict: 'E',
			templateUrl: 'public/directives/app/src/reportPhotos/reportPhotos.html',
			scope: {
				report: '=',
				editable: '&'
			},
			controller: function($scope) {

				$scope.srcAction = new MySrcAction({
					acceptedFiles: 'image/png,image/jpg,image/jpeg',
					maxFiles: NUMS.reportMaxPhotos,
					maxFileSize: NUMS.photoMaxSize,
					getFilesCount: function() { return $rootScope.apiData.report.photos.length; }
				});

				$scope.mainContextMenuConf = reportPhotosConf.getMainContextMenuConf($scope);
				$scope.srcContextMenuConf = reportPhotosConf.getSrcContextMenuConf($scope);

				$scope.srcThumbsCollection = new MySrcCollection({
					defaultUrl: URLS.itemImg,
					uploadRequest: reportPhotosService.makeSingleAws3UploadReq,
					constructUrl: function(i) {

						return reportPhotosService.constructPhotoUrl($scope.report.userId, $scope.report._id, $scope.report.photos[i].filename, true);
					}
				});

				$scope.srcSlidesCollection = new MySrcCollection({
					defaultUrl: URLS.itemImg,
					constructUrl: function(i) {

						return reportPhotosService.constructPhotoUrl($scope.report.userId, $scope.report._id, $scope.report.photos[i].filename, false);
					}
				});
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					var firstLoad = true;

					scope.$watch(function() { return scope.report; }, function(report, oldReport) {

						if (oldReport && oldReport._id == report._id && !firstLoad) { return; }

						if (report) {
							scope.srcThumbsCollection.init(scope.report.photos);
							reportPhotosService.initSlidesCollection(scope);
							firstLoad = false;
						}
					});
				};
			}
		};

		return reportPhotos;
	});

})();
(function() {

	'use strict';

	var reportPhotosConf = function($rootScope, reportPhotosService) {

		var conf = {
			getMainContextMenuConf: function(scope) {

				var isHidden = function() {
					if (scope.srcThumbsCollection) {
						return scope.srcThumbsCollection.collection.length === 0;
					}
				};

				return {
					icon: 'glyphicon glyphicon-option-horizontal',
					switchers: [
						{
							_id: 'update',
							label: $rootScope.hardData.imperatives[6],
							onClick: function() {

								if (scope.srcAction.getFilesCount() < scope.srcAction.maxFiles) {
									$rootScope.$broadcast('displayMyMultipleFilesInput', {
										cb: function(files) {
											reportPhotosService.uploadPhotos('addToSet', scope, files);
										}
									});

								} else {
									scope.srcAction.displayModalMessage('MAX_FILES_UPLOADED');
								}
							}
						},
						{
							_id: 'refresh',
							label: $rootScope.hardData.imperatives[19],
							onClick: function() {
								scope.srcThumbsCollection.init(scope.report.photos);
								reportPhotosService.initSlidesCollection(scope);
							}
						},
						{
							_id: 'select_all',
							label: $rootScope.hardData.imperatives[30],
							onClick: function() {
								scope.srcThumbsCollection.selectAll();
							},
							isHidden: isHidden
						},
						{
							_id: 'deselect_all',
							label: $rootScope.hardData.imperatives[29],
							onClick: function() {
								scope.srcThumbsCollection.deselectAll();
							},
							isHidden: isHidden
						},
						{
							_id: 'delete',
							label: $rootScope.hardData.imperatives[31],
							onClick: function() {
								reportPhotosService.deletePhotos('multiple', scope);
							},
							isHidden: isHidden
						}
					]
				};
			},
			getSrcContextMenuConf: function(scope) {

				var move = function(that) {
					scope.srcThumbsCollection.moveSingle(that._id, that.parent.data, function() {
						reportPhotosService.syncDb(scope, function() {
							reportPhotosService.initSlidesCollection(scope);
						});
					});
				};

				return {
					icon: 'glyphicon glyphicon-option-horizontal',
					switchers: [
						{
							_id: 'updateSingle',
							label: $rootScope.hardData.imperatives[5],
							onClick: function() {

								var that = this;

								$rootScope.$broadcast('displayMySingleFileInput', {
									cb: function(files) {
										reportPhotosService.uploadPhotos('updateSingle', scope, files, that.parent.data);
									}
								});
							}
						},
						{
							_id: 'delete',
							label: $rootScope.hardData.imperatives[14],
							onClick: function() {
								reportPhotosService.deletePhotos('single', scope, this.parent.data);
							}
						},
						{
							_id: 'refresh',
							label: $rootScope.hardData.imperatives[19],
							onClick: function() {
								this.parent.data.load(undefined, true);
							}
						},
						{
							_id: 'moveLeft',
							label: $rootScope.hardData.imperatives[20],
							onClick: function() {
								move(this);
							},
							isHidden: function() {
								if (scope.srcThumbsCollection) {
									return scope.srcThumbsCollection.collection.length < 2;
								}
							}
						},
						{
							_id: 'moveRight',
							label: $rootScope.hardData.imperatives[21],
							onClick: function() {
								move(this);
							},
							isHidden: function() {
								if (scope.srcThumbsCollection) {
									return scope.srcThumbsCollection.collection.length < 2;
								}
							}
						},
						{
							_id: 'set_as_avatar',
							label: $rootScope.hardData.imperatives[28],
							onClick: function() {

								var newAvatar = this.parent.data.filename;

								this.parent.data.load(undefined, true, function() {
									reportPhotosService.syncDb(scope, undefined, { newAvatar: newAvatar });
								});
							}
						}
					]
				};
			}
		};

		return conf;
	};

	reportPhotosConf.$inject = ['$rootScope', 'reportPhotosService'];
	angular.module('appModule').service('reportPhotosConf', reportPhotosConf);

})();
(function() {

	'use strict';

	var reportPhotosService = function($rootScope, $q, aws3Service, MySrcAction, ReportsRest, Restangular, URLS) {

		var self = {
			initSlidesCollection: function(scope) {

				scope.srcSlidesCollection.init(scope.report.photos, undefined, { doNotLoad: true });
			},
			uploadPhotos: function(actionId, scope, inputData, src) {

				// Validating input after choose
				scope.srcAction.validate(actionId, inputData).then(function(res) {

					// When action valid
					if (res.success) {

						// Preparing fileTypes array
						var fileTypes = [];

						for (var i in inputData) {
							if (inputData[i] instanceof File) { fileTypes.push(inputData[i].type); }
						}

						// Asking server for upload credentials for all files
						aws3Service.getCredentials('report_photos', { reportId: $rootScope.apiData.report._id, 'fileTypes': fileTypes }).then(function(res) {

							var args = {
								inputData: inputData,
								credentials: res.data,
								src: src,
								getReloadUrl: function(i) {
									return self.constructPhotoUrl($rootScope.apiData.loggedInUser._id, $rootScope.apiData.report._id, res.data[i].awsFilename, true);
								}
							};

							switch (actionId) {

								case 'addToSet':

									scope.srcThumbsCollection.addToSet(args, function(results) {
										self.syncDb(scope, function() {
											self.initSlidesCollection(scope);
										});
									});

									break;

								case 'updateSingle':

									scope.srcThumbsCollection.updateSingle(args, function(success) {

										if (!success) { return; }

										if ($rootScope.apiData.report.avatar == args.src.filename) {
											$rootScope.apiData.report.avatar = res.data[0].awsFilename;
										}

										self.syncDb(scope, function() {
											self.initSlidesCollection(scope);
										});
									});

									break;
							}

						}, function(res) { $rootScope.ui.modals.tryAgainLaterModal.show(); });

					// When action invalid
					} else { scope.srcAction.displayModalMessage(res.msgId); }
				});
			},
			deletePhotos: function(flag, scope, src) {

				var collection;

				switch (flag) {

					case 'single':
						collection = [src];
						break;

					case 'multiple':
						collection = scope.srcThumbsCollection.getSelectedCollection();
						break;
				}

				scope.srcThumbsCollection.removeFromSet({ collection: collection }, function(results) {

					if (results.indexOf(true) > -1) {

						self.syncDb(scope, function() {
							self.initSlidesCollection(scope);
						});
					}
				});
			},
			makeSingleAws3UploadReq: function(args, i) {

				var src = this;

				return $q(function(resolve) {

					var credentials = args.credentials[i];
					var inputData = args.inputData[i];

					// Creating form data
					var formData = MySrcAction.createFormDataObject(credentials.awsFormData, inputData);

					// Uploading to s3
					aws3Service.makeRequest(credentials.awsUrl, formData).success(function(res) {

						// When whole upload ended successfully

						src.filename = credentials.awsFilename;
						src.size = inputData.size;

						var report = $rootScope.apiData.report;

						resolve({
							success: true,
							url: self.constructPhotoUrl(report.userId, report._id, src.filename, true)
						});

					}).error(function(res) {
						resolve({ success: false });
					});
				});
			},
			syncDb: function(scope, cb, args) {

				var isAvatarOk = false;
				var copy = Restangular.copy(scope.report);
				copy.photos = [];

				if (args && args.newAvatar) { copy.avatar = args.newAvatar; }

				for (var i in scope.srcThumbsCollection.collection) {

					copy.photos[i] = {
						filename: scope.srcThumbsCollection.collection[i].filename,
						size: scope.srcThumbsCollection.collection[i].size
					};

					if (copy.photos[i].filename == copy.avatar) { isAvatarOk = true; }
				}

				if (!isAvatarOk) { copy.avatar = undefined; }

				copy.put().then(function(res) {

					scope.report.avatar = res.data.avatar;
					scope.report.photos = res.data.photos;
					if (cb) { cb(true); }

				}, function(res) {

					$rootScope.ui.modals.tryAgainLaterModal.hideCb = function() {
						scope.srcThumbsCollection.init(scope.report.photos);
						self.initSlidesCollection(scope);
						$rootScope.ui.modals.tryAgainLaterModal.hideCb = undefined;
					};

					$rootScope.ui.modals.tryAgainLaterModal.show();
				});
			},
			constructPhotoUrl: function(userId, reportId, filename, useThumb) {

				if (!useThumb) {
					return URLS.AWS3_UPLOADS_BUCKET_URL + userId + '/reports/' + reportId + '/' + filename;

				} else {
					return URLS.AWS3_RESIZED_UPLOADS_BUCKET_URL + 'resized-' + userId + '/reports/' + reportId + '/' + filename;
				}
			}
		};

		return self;
	};

	reportPhotosService.$inject = ['$rootScope', '$q', 'aws3Service', 'MySrcAction', 'ReportsRest', 'Restangular', 'URLS'];
	angular.module('appModule').service('reportPhotosService', reportPhotosService);

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('userAvatar', function(userAvatarService, userAvatarConf, MySrc, ui) {

		var userAvatar = {
			restrict: 'E',
			templateUrl: 'public/directives/app/src/userAvatar/userAvatar.html',
			scope: {
				user: '=',
				editable: '=',
				noLink: '&',
				withLabel: '='
			},
			controller: function($scope) {

				$scope.src = new MySrc({
					defaultUrl: userAvatarConf.defaultUrl,
					uploadRequest: userAvatarService.uploadRequest,
					removeRequest: userAvatarService.removeRequest
				});

				$scope.srcContextMenuConf = userAvatarConf.getSrcContextMenuConf($scope);
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					scope.$watch(function() { return scope.user; }, function(user) {

						if (user) {
							if (scope.withLabel) { scope.src.label = scope.user.username.truncate(15); }
							if (!scope.noLink()) { scope.src.href = '/#/profile?id=' + scope.user._id; }
							userAvatarService.loadPhoto(scope);
						}
					});
				};
			}
		};

		return userAvatar;
	});

})();
(function() {

	'use strict';

	var userAvatarConf = function($rootScope, userAvatarService, utilService) {

		var conf = {
			defaultUrl: 'public/imgs/avatar.png',
			getSrcContextMenuConf: function(scope) {

				return {
					icon: 'glyphicon glyphicon-option-horizontal',
					isHidden: function() {
						return !scope.user._isTheOneLoggedIn();
					},
					switchers: [
						{
							_id: 'update',
							label: $rootScope.hardData.imperatives[5],
							onClick: function() {

								$rootScope.$broadcast('displayMyImgCropModal', {
									acceptCb: function(dataURI) {

										scope.src.update({ file: utilService.dataURItoBlob(dataURI), doReload: true }).then(function(success) {
											if (success) { userAvatarService.loadPhoto(scope, true); }
										});
									}
								});
							}
						},
						{
							_id: 'delete',
							label: $rootScope.hardData.imperatives[14],
							onClick: function() {

								scope.src.remove(undefined, true);
							},
							isHidden: function() { return scope.src.isDefaultUrlLoaded(); }
						},
						{
							_id: 'refresh',
							label: $rootScope.hardData.imperatives[19],
							onClick: function() {

								userAvatarService.loadPhoto(scope, true);
							}
						}
					]
				};
			}
		};

		return conf;
	};

	userAvatarConf.$inject = ['$rootScope', 'userAvatarService', 'utilService'];
	angular.module('appModule').service('userAvatarConf', userAvatarConf);

})();
(function() {

	'use strict';

	var userAvatarService = function($rootScope, $q, aws3Service, MySrcAction, Restangular, URLS) {

		var service = {
			loadPhoto: function(scope, force) {

				scope.src.load(service.constructPhotoUrl(scope, false), force, function(success) {

					if (!success) {
						scope.src.load(service.constructPhotoUrl(scope, false), force);
					}
				});
			},
			constructPhotoUrl: function(scope, useThumb) {

				if (scope.user.photos.length === 0) { return scope.src.defaultUrl; }

				if (!useThumb) {
					return URLS.AWS3_UPLOADS_BUCKET_URL + scope.user._id + '/' + scope.user.photos[0].filename;

				} else {
					return URLS.AWS3_RESIZED_UPLOADS_BUCKET_URL + 'resized-' + scope.user._id + '/' + scope.user.photos[0].filename;
				}
			},
			uploadRequest: function(args) {

				var src = this;

				return $q(function(resolve) {

					aws3Service.getCredentials('user_avatar', { fileTypes: [args.file.type] }).then(function(res1) {

						var formData = MySrcAction.createFormDataObject(res1.data[0].awsFormData, args.file);

						aws3Service.makeRequest(res1.data[0].awsUrl, formData).success(function(res2) {

							$rootScope.apiData.profileUser.photos[0] = {
								filename: res1.data[0].awsFilename,
								size: args.file.size
							};

							$rootScope.apiData.profileUser.put().then(function(res3) {

								$rootScope.apiData.loggedInUser = Restangular.copy($rootScope.apiData.profileUser);

								resolve({
									success: true,
									url: service.constructPhotoUrl({
										src: src,
										user: $rootScope.apiData.profileUser
									}, true)
								});

							}, function(res3) {
								resolve({ success: false });
							});

						}).error(function(res2) {
							resolve({ success: false });
						});

					}, function(res1) {
						resolve({ success: false });
					});
				});
			},
			removeRequest: function() {

				return $q(function(resolve) {

					$rootScope.apiData.profileUser.photos = [];

					$rootScope.apiData.profileUser.put().then(function() {

						$rootScope.apiData.loggedInUser = Restangular.copy($rootScope.apiData.profileUser);
						resolve(true);

					}, function() {
						resolve(false);
					});
				});
			}
		};

		return service;
	};

	userAvatarService.$inject = ['$rootScope', '$q', 'aws3Service', 'MySrcAction', 'Restangular', 'URLS'];
	angular.module('appModule').service('userAvatarService', userAvatarService);

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myDirective', function(hardDataService) {

		var myDirective = {
			restrict: 'A',
			controller: function($scope) {

				// Binding hard coded strings
				hardDataService.bind($scope);
			}
		};

		return myDirective;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myBtn', function($rootScope) {

		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'public/directives/my/btn/myBtn/myBtn.html',
			scope: {
				ctrlClass: '=',
				clickAction: '=',
				clickArgs: '=',
				clickContext: '=',
				showModalId: '@',
				explicitLabel: '=',
				hardData: '='
			},
			controller: function($scope) {},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					if (scope.showModalId) {

						scope.onClick = function() {
							$rootScope.$broadcast(scope.showModalId);
						};

					} else if (typeof scope.clickAction == 'function') {

						scope.onClick = function() {

							if (scope.clickContext) {
								scope.clickAction.call(scope.clickContext, scope.clickArgs);

							} else {
								scope.clickAction(scope.clickArgs);
							}
						};
					}
				};
			}
		};
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myScrollTopBtn', function() {

		var myScrollTopBtn = {
			restrict: 'E',
			templateUrl: 'public/directives/my/btn/myScrollTopBtn/myScrollTopBtn.html',
			controller: function($scope) {

				$scope.scroll = function() {
					$('html, body').animate({ scrollTop: 0 }, 'fast');
				};
			}
		};

		return myScrollTopBtn;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myCollectionBrowser', function($rootScope) {

		var myCollectionBrowser = {
			restrict: 'E',
			transclude: {
				frontctrls: '?frontctrls',
				endctrls: '?endctrls',
				extractrls: '?extractrls',
				elems: '?elems',
			},
			templateUrl: 'public/directives/my/collection/myCollectionBrowser/myCollectionBrowser.html',
			scope: {
				ins: '=',
				noScrollTopBtn: '='
			},
			controller: function($scope) {

				$scope.hardData = $rootScope.hardData;
			}
		};

		return myCollectionBrowser;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('myComments', function($rootScope, $timeout, $moment, myCommentsService, CommentsRest, myClass) {

		var myComments = {
			restrict: 'E',
			templateUrl: 'public/directives/my/collection/myComments/myComments.html',
			scope: {
				nestingLevel: '<',
				apiObj: '=',
				out: '='
			},
			controller: function($scope) {

				$scope.apiData = $rootScope.apiData;
				$scope.hardData = $rootScope.hardData;
				$scope.$moment = $moment;

				$scope.onToggleRepliesClick = function() { myCommentsService.toggle.call(this, $scope); };

				$scope.myForm = new myClass.MyForm({
					ctrlId: $scope.nestingLevel === 0 ? 'commentsForm' : 'commentsReplyForm',
					model: new myClass.MyDataModel({ userId: {}, content: {} }),
					submitAction: function(args) {

						this.model.set({ 'userId': $rootScope.apiData.loggedInUser._id });
						return CommentsRest.post(this.model.getValues(), myCommentsService.getReqQuery($scope));
					},
					submitSuccessCb: function(res) {

						$timeout(function() {
							$scope.myForm.model.reset(true, true);
							myCommentsService.init($scope);
						});
					}
				});

				$scope.commentContextMenuConf = {
					icon: 'glyphicon glyphicon-option-horizontal',
					switchers: [
						{
							_id: 'edit',
							label: $scope.hardData.imperatives[33],
							onClick: function() {}
						},
						{
							_id: 'delete',
							label: $scope.hardData.imperatives[14],
							onClick: function() {

								this.parent.data.remove(myCommentsService.getReqQuery($scope)).then(function() {
									myCommentsService.init($scope, true);

								}, function() {
									myCommentsService.init($scope, true);
								});
							}
						}
					]
				};
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					switch (scope.nestingLevel) {

						case 0:

							scope.$watch(function() { return scope.apiObj; }, function(newApiObj) {

								if (newApiObj) {
									myCommentsService.init(scope, true);
									scope.out.topCollectionBrowser = scope.collectionBrowser;
								}
							});

							break;

						case 1:

							myCommentsService.init(scope);
							break;
					}
				};
			}
		};

		return myComments;
	});

})();
(function() {

	'use strict';

	var myCommentsService = function($timeout, MyCollectionBrowser, CommentsRest) {

		var service = this;

		service.init = function(scope, doNotScroll) {

			if (!scope.collectionBrowser) {

				scope.collectionBrowser = new MyCollectionBrowser({
					singlePageSize: 10,
					fetchData: function(query) {
						return CommentsRest.getList(service.getReqQuery(scope));
					}
				});

				scope.collectionBrowser.beforeInit = function() {
					delete CommentsRest.activeCollectionBrowser;
					CommentsRest.activeCollectionBrowser = this;
					if (scope.nestingLevel === 0 && service.activeComment) { service.activeComment.showReplies = false; }
				};

				scope.collectionBrowser.refreshCb = function() {
					service.fixScrollPos(scope);
				};
			}

			scope.collectionBrowser.init(function() {
				if (!doNotScroll) { service.fixScrollPos(scope); }
			});
		};

		service.getReqQuery = function(scope) {

			var query = {};

			if (scope.nestingLevel === 0) {
				query[scope.apiObj.route.substring(0, scope.apiObj.route.length - 1) + 'Id'] = scope.apiObj._id;

			} else {
				query.parentId = service.activeComment._id;
			}

			return query;
		};

		service.toggle = function(scope) {

			var comment = this;

			// Showing replies
			if (scope.nestingLevel === 0 && !comment.showReplies) {

				// Clearing model
				scope.myForm.model.reset(true, true);

				// Hiding comment reply section if shown
				if (service.activeComment) { service.activeComment.showReplies = false; }

				// Setting new comment as active and showing reply section
				service.activeComment = comment;
				service.activeComment.showReplies = true;

			// Hiding replies
			} else {

				comment.showReplies = false;
				$('html, body').animate({ scrollTop: $('#comment_' + service.activeComment._id).offset().top - 5 }, 'fast');
				service.activeComment = undefined;
			}
		};

		service.fixScrollPos = function(scope) {

			if (scope.nestingLevel === 0) {

				$timeout(function() {
					$('html, body').animate({ scrollTop: $('#myComments_' + scope.nestingLevel).offset().top - 5 }, 'fast');
				});

			} else {

				$timeout(function() {
					$('html, body').animate({ scrollTop: $('#comment_' + service.activeComment._id).offset().top - 5 }, 'fast');
				});
			}
		};

		return service;
	};

	myCommentsService.$inject = ['$timeout', 'MyCollectionBrowser', 'CommentsRest'];
	angular.module('appModule').service('myCommentsService', myCommentsService);

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myElemSelector', function() {

		var myElemSelector = {
			restrict: 'E',
			templateUrl: 'public/directives/my/collection/myElemSelector/myElemSelector.html',
			scope: {
				isSelected: '='
			},
			controller: function() {},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					var button = $(elem).find('button').get()[0];

					$(button).on('click', function() {

						scope.isSelected = !scope.isSelected;
						scope.$apply();
					});
				};
			}
		};

		return myElemSelector;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myLoader', function($timeout) {

		var myLoader = {
			restrict: 'E',
			templateUrl: 'public/directives/my/display/myLoader/myLoader.html',
			scope: {
				fixedCentered: '=',
				absCentered: '='
			}
		};

		return myLoader;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('myPanel', function(MySwitchable) {

		var myPanel = {
			restrict: 'E',
			templateUrl: 'public/directives/my/display/myPanel/myPanel.html',
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
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myPopOverIcon', function() {

		var myPopOverIcon = {
			restrict: 'E',
			transclude: {
				icon: 'span'
			},
			templateUrl: 'public/directives/my/display/myPopOverIcon/myPopOverIcon.html',
			scope: {
				hardData: '='
			}
		};

		return myPopOverIcon;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myCaptcha', function($timeout, grecaptchaService) {

		var myCaptcha = {
			restrict: 'E',
			template: '<div id="{{ ctrlId }}" ng-show="visible" style="margin-bottom: 20px;" my-directive></div>',
			scope: {
				ctrlId: '=',
				actionName: '='
			},
			controller: function($scope, $timeout) {

				$timeout(function() {

					// Loading captcha
					$scope.grecaptchaId = grecaptchaService.load($scope.ctrlId, $scope.actionName, function() {

						// When captcha resolved callback
						$timeout(function() { $scope.visible = false; }, 1000);
					});
				});
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					// Getting parent form scope
					var form = $(elem).parents('.myForm:first');
					var formScope = $(form).scope();

					scope.$watch('visible', function(newValue) {
						if (newValue === true) { grecaptchaService.reset(scope.grecaptchaId); }
					});



					$timeout(function() {

						// Setting initial captcha visibility
						grecaptchaService.shouldBeVisible(scope.ctrlId, function(visible) {
							formScope.captcha = scope;
							scope.visible = visible;
						});
					});
				};
			}
		};

		return myCaptcha;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('myForm', function(MyLoader) {

		return {
			restrict: 'E',
			transclude: true,
			templateUrl: 'public/directives/my/form/myForm/myForm.html',
			scope: {
				ins: '=',
				hardData: '='
			},
			controller: function($scope) {

				$scope.ins.scope = $scope;
				$scope.loader = new MyLoader();
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {};
			}
		};
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('myFormErrorIcon', function() {

		var myFormErrorIcon = {
			restrict: 'E',
			templateUrl: 'public/directives/my/form/myFormErrorIcon/myFormErrorIcon.html',
			scope: {
				args: '='
			}
		};

		return myFormErrorIcon;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myDateInput', function() {

		var myDateInput = {
			restrict: 'E',
			templateUrl: 'public/directives/my/input/myDateInput/myDateInput.html',
			scope: {
				ctrlId: '=',
				ctrlMaxLength: '=',
				ctrlMinValue: '=',
				ctrlMaxValue: '=',
				model: '=',
				hardData: '=',
				hideErrors: '=',
				isRequired: '='
			},
			controller: function($scope) {},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {


				};
			}
		};

		return myDateInput;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('mySingleFileInput', function() {

		var mySingleFileInput = {
			restrict: 'E',
			template: '<input id="mySingleFileInput" name="file" type="file" />',
			scope: true,
			controller: function($scope) {},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					var mySingleFileInput = $(elem).find('#mySingleFileInput').get()[0];
					var onChangeCb;

					scope.$on('displayMySingleFileInput', function(e, args) {
						onChangeCb = args.cb;
						$(mySingleFileInput).val(undefined);
						$(mySingleFileInput).click();
					});

					$(mySingleFileInput).on('change', function(e) {
						if (e.target.files.length > 0) { onChangeCb(e.target.files); }
					});
				};
			}
		};

		return mySingleFileInput;
	});

	appModule.directive('myMultipleFilesInput', function() {

		var myMultipleFilesInput = {
			restrict: 'E',
			template: '<input id="myMultipleFilesInput" name="file" type="file" multiple />',
			scope: true,
			controller: function($scope) {},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					var myMultipleFilesInput = $(elem).find('#myMultipleFilesInput').get()[0];
					var onChangeCb;

					scope.$on('displayMyMultipleFilesInput', function(e, args) {
						onChangeCb = args.cb;
						$(myMultipleFilesInput).val(undefined);
						$(myMultipleFilesInput).click();
					});

					$(myMultipleFilesInput).on('change', function(e) {
						if (e.target.files.length > 0) { onChangeCb(e.target.files); }
					});
				};
			}
		};

		return myMultipleFilesInput;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('myGooglePlaceAutoComplete', function() {

		var myGooglePlaceAutoComplete = {
			restrict: 'E',
			templateUrl: 'public/directives/my/input/myGooglePlaceAutoComplete/myGooglePlaceAutoComplete.html',
			scope: {
				ctrlId: '=',
				model: '=',
				hardData: '=',
				hideErrors: '=',
				autocomplete: '='
			},
			controller: function($scope) {},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					var initAutoComplete = function() {

						var input = $(elem).find('input').get()[0];

						scope.autocomplete.ins = new google.maps.places.Autocomplete(input);
						scope.autocomplete.label = null;

						scope.autocomplete.ins.addListener('place_changed', function() {

							var place = scope.autocomplete.ins.getPlace();

							if (place) {
								console.log(place);
								scope.autocomplete.label = place.formatted_address;
								scope.$apply();
							}
						});
					};

					scope.$watch('model.value.active', function(newValue, oldValue) {

						if (!newValue) {
							initAutoComplete();

						} else {

							var geocoder = new google.maps.Geocoder();

							geocoder.geocode({ 'address': newValue }, function(results, status) {

								if (status == 'OK' && results) {
									if (newValue == results[0].formatted_address) {
										scope.autocomplete.ins.set('place', results[0]);
									}
								}
							});
						}
					});

					initAutoComplete();
				};
			}
		};

		return myGooglePlaceAutoComplete;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('myInput', function() {

		var myInput = {
			restrict: 'E',
			templateUrl: 'public/directives/my/input/myInput/myInput.html',
			scope: {
				ctrlId: '=',
				ctrlType: '=',
				ctrlMaxLength: '=',
				ctrlMinValue: '=',
				ctrlMaxValue: '=',
				model: '=',
				hardData: '=',
				hideErrors: '=',
				isDisabled: '='
			},
			controller: function($scope) {},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {


				};
			}
		};

		return myInput;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myTextArea', function() {

		var myTextArea = {
			restrict: 'E',
			templateUrl: 'public/directives/my/input/myTextArea/myTextArea.html',
			scope: {
				ctrlId: '=',
				ctrlMaxLength: '=',
				model: '=',
				autoResizable: '<',
				hardData: '='
			},
			controller: function($scope) {},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					if (scope.autoResizable) {

						var textarea = $(elem).find('textarea').get()[0];
						$(textarea).css('overflow', 'hidden');

						scope.resize = function(height) {
							$(textarea).css('height', 'auto');
							$(textarea).css('height', height || $(textarea).prop('scrollHeight') + 'px');
						};

						scope.$watch('model.value.active', function(newValue, oldValue) {
							if (!newValue) { scope.resize(65); }
						});
					}
				};
			}
		};

		return myTextArea;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myContextMenu', function() {

		var myContextMenu = {
			restrict: 'E',
			templateUrl: 'public/directives/my/list/myContextMenu/myContextMenu.html',
			scope: {
				ins: '='
			},
			controller: function($scope) {


			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {


				};
			}
		};

		return myContextMenu;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myDropDown', function() {

		return {
			restrict: 'E',
			templateUrl: 'public/directives/my/list/myDropDown/myDropDown.html',
			scope: {
				ins: '=',
				openDirection: '=',
				ctrlClass: '='
			}
		};
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myListGroup', function() {

		return {
			restrict: 'E',
			templateUrl: 'public/directives/my/list/myListGroup/myListGroup.html',
			scope: {
				ins: '='
			}
		};
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myNavDropDown', function() {

		var myNavDropDown = {
			restrict: 'E',
			templateUrl: 'public/directives/my/list/myNavDropDown/myNavDropDown.html',
			scope: {
				ins: '='
			}
		};

		return myNavDropDown;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myNavMenu', function() {

		var myNavMenu = {
			restrict: 'E',
			replace: true,
			templateUrl: 'public/directives/my/list/myNavMenu/myNavMenu.html',
			scope: {
				ins: '='
			}
		};

		return myNavMenu;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('mySelect', function(jsonService) {

		return {
			restrict: 'E',
			templateUrl: 'public/directives/my/list/mySelect/mySelect.html',
			scope: {
				ctrlId: '=',
				model: '=',
				collection: '=',
				nestedCollectionFieldName: '=',
				propNames: '=',
				optionZero: '=',
				hardData: '=',
				hideErrors: '='
			},
			link: function(scope, elem, attrs) {

				var parentGroup = $(elem).parents('my-selects-group').get();

				// If select is nested in mySelectGroup
				if (parentGroup.length > 0) {

					// Getting select index in parent group
					var myIndex = $($(elem).parent()[0].children).index(elem);



					/* Setting for all selects */

					// Defining onSelect event handler
					scope.onSelect = function() {

						var allSelectsCount = $(elem).parent()[0].children.length;

						// For all selects below this one
						for (var i = myIndex + 1; i < allSelectsCount; i++) {

							// Getting select scope
							var select_scope = $($($(elem).parent()[0].children[i]).find('select')[0]).scope();

							// Resetting scope variables
							select_scope.model.value.active = '';
							select_scope.collection = undefined;
						}
					};



					/* If I am not top select */

					if (myIndex > 0) {

						// Getting scope of the first select above
						var select_scope = $($($(elem).parent()[0].children[myIndex - 1]).find('select')[0]).scope();

						// Watching for its model changes
						scope.$watch(function() { return select_scope.model.value.active; }, function(newValue) {

							if (newValue) {

								// Getting collection of the first select above
								var collection = select_scope.collection;

								// Setting proper collection for myself
								jsonService.find.objectByProperty(collection, select_scope.propNames.optionValue, newValue, function(obj) {
									if (obj) { scope.collection = obj[scope.nestedCollectionFieldName]; }
								});

							} else {

								// Resetting own scope collection
								scope.collection = undefined;
							}
						});
					}



					/* Setting for select with particular index */

					switch (myIndex) {

						case 0:

							// Watching parent group collection for changes
							scope.$watch('$parent.$parent.collection', function(newValue) {
								if (newValue) {
									scope.collection = newValue;
								}
							});

							// Watching for model changes
							scope.$watch('model.value.active', function(newValue) {

								// Selecting option 1 as default, later setting model overrides this
								if (!scope.optionZero && !newValue && scope.collection) {
									scope.model.value.active = scope.collection[0][scope.propNames.optionValue];
								}
							});

							break;
					}
				}
			}
		};
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('mySelectsGroup', function(hardDataService) {

		var mySelectsGroup = {
			restrict: 'E',
			templateUrl: 'public/directives/my/list/mySelectsGroup/mySelectsGroup.html',
			transclude: true,
			scope: {
				collection: '=',
				model: '=',
				hardData: '='
			}
		};

		return mySelectsGroup;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myTabs', function() {

		return {
			restrict: 'E',
			templateUrl: 'public/directives/my/list/myTabs/myTabs.html',
			scope: {
				ins: '='
			}
		};
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('myImgCropModal', function($rootScope, $window, $timeout, MySrcAction, MyModal, MyLoader, NUMS) {

		var imgId = '#cropImg';
		var inputId = '#cropInput';

		var flushCropper = function(scope) {

			$(inputId).val(undefined);
			$(imgId).cropper('destroy');
			$(imgId).attr('src', '');
			scope.selectedFile = undefined;
		};

		var myImgCropModal = {
			restrict: 'E',
			templateUrl: 'public/directives/my/modal/myImgCropModal/myImgCropModal.html',
			scope: {
				winTitle: '<',
				maxFileSize: '<'
			},
			controller: function($scope) {

				var srcAction = new MySrcAction({
					acceptedFiles: 'image/png,image/jpg,image/jpeg',
					maxFileSize: $scope.maxFileSize
				});

				$scope.myModal = new MyModal({ id: 'imgCropModal', title: $scope.winTitle });
				$scope.loader = new MyLoader();
				$scope.selectedFile = undefined;
				$scope.mode = 'crop';

				// Event methods
				$scope.onBrowseClick = function() {

					$(inputId).click();
				};

				$scope.onFileSelected = function(e) {

					if (e.target.files.length == 1) {

						srcAction.validate('updateSingle', [e.target.files[0]]).then(function(result) {

							if (result.success) {

								$scope.loader.start(false, function() {
									$scope.selectedFile = e.target.files[0];
									$scope.mode = 'crop';
									$scope.$apply();
									$(imgId).cropper('replace', URL.createObjectURL(e.target.files[0]));
									$timeout(function() { $scope.loader.stop(); }, $scope.loader.minLoadTime);
								});

							} else { srcAction.displayModalMessage(result.msgId); }
						});
					}
				};

				$scope.onZoomInClick = function() {

					$(imgId).cropper('zoom', 0.1);
				};

				$scope.onZoomOutClick = function() {

					$(imgId).cropper('zoom', -0.1);
				};

				$scope.onRotateClick = function() {

					$(imgId).cropper('rotate', 90);
				};

				$scope.onResetClick = function() {

					$(imgId).cropper('reset');
				};

				$scope.onSwitchModeClick = function() {

					if ($scope.mode == 'crop') {
						$scope.mode = 'move';
						$(imgId).cropper('setDragMode', 'move');

					} else if ($scope.mode == 'move') {
						$scope.mode = 'crop';
						$(imgId).cropper('setDragMode', 'crop');
					}
				};
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					// Creating display modal event
					scope.$on('displayMyImgCropModal', function(e, args) {

						flushCropper(scope);

						// Showing modal
						scope.myModal.show({
							acceptCb: function() {

								if (scope.selectedFile) {
									var dataURI = $(imgId).cropper('getCroppedCanvas').toDataURL(scope.selectedFile.type);
									args.acceptCb(dataURI);
								}
							}
						});

						// Cropper settings
						$(imgId).cropper({
							viewMode: 1,
							aspectRatio: 1,
							autoCropArea: 0.5,
							minCropBoxWidth: 50,
							minCropBoxHeight: 50,
							background: false
						});
					});

					// Window resize event
					angular.element($window).bind('resize', function() {

						if (scope.selectedFile) {
							$(imgId).cropper('replace', URL.createObjectURL(scope.selectedFile));
						}
					});
				};
			}
		};

		return myImgCropModal;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myModal', function($rootScope, $timeout) {

		return {
			restrict: 'E',
			templateUrl: 'public/directives/my/modal/myModal/myModal.html',
			transclude: {
				header: '?myModalHeader',
				body: '?myModalBody',
				footer: '?myModalFooter'
			},
			scope: {
				ins: '=',
				slideInFromLeft: '='
			},
			controller: function($scope) {},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					// onShow
					$('.modal').on('show.bs.modal', function() {

						$rootScope.isAnyModalOpen = true;
					});

					// onHide
					$('.modal').on('hide.bs.modal', function() {

						$rootScope.isAnyModalOpen = false;

						if (scope.ins.hideCb) {
							$timeout(function() { scope.ins.hideCb(); }, 500);
						}
					});
				};
			}
		};
	});
})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('myStandardModal', function() {

		var myStandardModal = {
			restrict: 'E',
			templateUrl: 'public/directives/my/modal/myStandardModal/myStandardModal.html',
			scope: {
				ins: '=',
				type: '@'
			}
		};

		return myStandardModal;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('mySrc', function($timeout, MySwitchable) {

		var mySrc = {
			restrict: 'E',
			templateUrl: 'public/directives/my/src/mySrc/mySrc.html',
			scope: {
				ins: '=',
				type: '@',
				isSelectable: '&',
				contextMenuConf: '=',
				hrefTarget: '@'
			},
			controller: function($scope) {

				if ($scope.isSelectable() || $scope.contextMenuConf) {
					$scope.onMouseEnter = function() { $scope.srcCtrlsVisible = true; };
					$scope.onMouseLeave = function() { $scope.srcCtrlsVisible = false; };
				}

				if ($scope.isSelectable()) { $scope.ins.isSelected = false; }

				if ($scope.contextMenuConf) {
					$scope.contextMenu = new MySwitchable($scope.contextMenuConf);
					$scope.contextMenu.data = $scope.ins;
				}
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					var srcCtrl = $(elem).find(scope.type).get()[0];

					$(srcCtrl).bind('load', function() {
						scope.$apply();
		            	scope.ins.deferred.resolve(true);
		            });

		            $(srcCtrl).bind('error', function() {
		            	scope.$apply();
		                scope.ins.deferred.resolve(false);
		            });
				};
			}
		};

		return mySrc;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('mySrcSlides', function(MySwitchable) {

		var mySrcSlides = {
			restrict: 'E',
			templateUrl: 'public/directives/my/src/mySrcSlides/mySrcSlides.html',
			scope: {
				mySrcCollection: '=',
				srcType: '@'
			},
			controller: function($scope) {


			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					scope.$watchCollection('mySrcCollection.collection', function(collection) {

						if (collection) {

							var switchers = [];

							for (var i in collection) {
								switchers.push({ _id: collection[i].index, index: collection[i].index });
							}

							scope.mySwitchable = new MySwitchable({ switchers: switchers });
							scope.mySrcCollection.switchable = scope.mySwitchable;
						}
					});
				};
			}
		};

		return mySrcSlides;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('mySrcThumbs', function($rootScope, $timeout, MySwitchable, MyModal) {

		var mySrcThumbs = {
			restrict: 'E',
			templateUrl: 'public/directives/my/src/mySrcThumbs/mySrcThumbs.html',
			scope: {
				srcThumbsCollection: '=',
				srcSlidesCollection: '=',
				mainContextMenuConf: '=',
				srcContextMenuConf: '=',
				browsingWindowId: '@',
				srcType: '@',
				isSrcSelectable: '&',
			},
			controller: function($scope) {

				// Creating modal instance for slides
				$scope.srcSlidesModal = new MyModal({ id: $scope.browsingWindowId });

				// Initializing main context menu
				if ($scope.mainContextMenuConf) {
					$scope.mainContextMenu = new MySwitchable($scope.mainContextMenuConf);
				}
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					// When collection browsing window available
					if (scope.browsingWindowId) {

						var loadSingleSrc = function(index) {

							scope.srcSlidesCollection.collection[index].load(undefined, undefined, function() {
								scope.srcSlidesCollection.collection[index].href = scope.srcSlidesCollection.collection[index].url;
							});
						};

						// Watching thumbs collection srcs
						scope.$watchCollection('srcThumbsCollection.collection', function(collection) {

							if (collection) {

								var onClick = function() {

									if (scope.srcSlidesCollection.switchable) {

										var index = this.index;

										// Changing active slides switchable
										scope.srcSlidesCollection.switchable.switchers[index].activate({ doNotLoad: true });

										// Displaying modal
										scope.srcSlidesModal.show();

										// Starting loading src
										$timeout(function() { loadSingleSrc(index); }, 500);
									}
								};

								// Binding click event to each src
								for (var i in collection) {
									collection[i].onClick = onClick;
								}
							}
						});

						// Watching slides srcs switchable
						scope.$watch('srcSlidesCollection.switchable', function(switchable) {

							if (switchable) {

								var onActivate = function(args) {

									var index = this.index;
									scope.srcSlidesModal.title = scope.srcSlidesCollection.collection[index].filename + ' (' + (index + 1) + '/' + scope.srcSlidesCollection.collection.length + ')';
									if (!args || !args.doNotLoad) { loadSingleSrc(index); }
								};

								for (var i in switchable.switchers) {
									switchable.switchers[i].onActivate = onActivate;
								}
							}
						});
					}
				};
			}
		};

		return mySrcThumbs;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myAlert', function() {

		var myAlert = {
			restrict: 'E',
			template: '<div class="myAlert alert no_selection" ng-class="ctrlClass" role="alert" ng-bind="message" my-directive></div>',
			scope: {
				ctrlClass: '=',
				hardData: '='
			}
		};

		return myAlert;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myLabel', function() {

		var myLabel = {
			restrict: 'E',
			templateUrl: 'public/directives/my/text/myLabel/myLabel.html',
			scope: {
				text: '=',
				cssClass: '='
			}
		};

		return myLabel;
	});

})();