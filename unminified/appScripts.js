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
		AWS3_RESIZED_UPLOADS_BUCKET_URL: 'https://s3.amazonaws.com/laf.useruploadsresized/'
	};

	var nums = {
		reportMaxPhotos: 15,
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

	angular.module('appModule').run(function($rootScope, $location, $timeout, $state, $moment, apiService, logService, ui, uiThemeService, sessionConst) {

		//logService.resetAll();
		apiService.setup();
		uiThemeService.include(sessionConst.theme);
		$moment.locale(sessionConst.language);

		if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }



		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

			if (fromState.name.split('.')[0] != toState.name.split('.')[0]) {
				ui.loaders.renderer.start();
			}

			if (fromState != toState) {
				$('.modal').modal('hide');
				$('.navbar-collapse').collapse('hide');
			}
		});

		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

			fromState.scrollY = window.scrollY;

			$timeout(function() {

				var newScrollY;

				switch (toState.name) {

					case 'app.profile':
					case 'app.report':

						if (toState.id == toParams.id) {
							newScrollY = $state.current.scrollY;

						} else {
							newScrollY = 0;
						}

						toState.id = toParams.id;
						break;

					case 'app.search':
						newScrollY = $state.current.scrollY;
						break;

					case 'app.report.tab':
						return;

					default:
						newScrollY = 0;
						break;
				}

				$('html, body').animate({ scrollTop: newScrollY }, 'fast');
			});

			$timeout(function() { ui.loaders.renderer.stop(); }, 3000);
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

		this.profileReportsContextMenu = {
			icon: 'glyphicon glyphicon-option-horizontal',
			switchers: [
				{
					_id: 'select_all',
					label: $rootScope.hardData.imperatives[30],
					onClick: function() {

						reportsConf.profileCollectionBrowser.selectAll();
					}
				},
				{
					_id: 'deselect_all',
					label: $rootScope.hardData.imperatives[29],
					onClick: function() {

						reportsConf.profileCollectionBrowser.deselectAll();
					}
				},
				{
					_id: 'delete',
					label: $rootScope.hardData.imperatives[31],
					onClick: function() {

						var selectedReports = reportsConf.profileCollectionBrowser.getSelectedCollection();
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

	var settingsListGroupConf = function($rootScope, hardDataService) {

		var hardData = hardDataService.get();

		var config = {
			_ctrlId: 'settingsListGroup',
			switchers: [
				{
					_id: 'application',
					label: hardData.sections[7],
					onActivate: function() {
						$rootScope.globalFormModels.appConfigModel.set();
					}
				},
				{
					_id: 'account',
					label: hardData.sections[8],
					onActivate: function() {
						$rootScope.globalFormModels.personalDetailsModel.set();
						$rootScope.globalFormModels.passwordModel.clear();
					}
				},
				{
					_id: 'danger',
					label: hardData.sections[24],
					onActivate: function() {
						$rootScope.globalFormModels.deactivationModel.clear();
					}
				}
			]
		};

		return config;
	};



	settingsListGroupConf.$inject = ['$rootScope', 'hardDataService'];
	angular.module('appModule').service('settingsListGroupConf', settingsListGroupConf);

})();
(function() {

	'use strict';

	var startTabsConf = function($rootScope, hardDataService) {

		var hardData = hardDataService.get();

		var config = {
			_ctrlId: 'startTabs',
			switchers: [
				{
					_id: 'login',
					label: hardData.sections[17],
					info: hardData.description[0],
					route: '/#/start/login',
					onActivate: function() { $rootScope.globalFormModels.userModel.clearErrors(); }
				},
				{
					_id: 'register',
					label: hardData.sections[18],
					info: hardData.description[1],
					route: '/#/start/register',
					onActivate: function() { $rootScope.globalFormModels.userModel.clearErrors(); }
				},
				{
					_id: 'recover',
					label: hardData.labels[4],
					info: hardData.description[2],
					route: '/#/start/recover',
					onActivate: function() { $rootScope.globalFormModels.userModel.clearErrors(); }
				},
				{
					_id: 'status',
					label: hardData.sections[23],
					info: hardData.information[8],
					route: '/#/start/status',
					onActivate: function() { $rootScope.globalFormModels.userModel.clearErrors(); }
				}
			]
		};

		return config;
	};

	var settingsTabsConf = function($rootScope, hardDataService) {

		var hardData = hardDataService.get();

		var tabs = {
			application: {
				_ctrlId: 'appTabs',
				switchers: [
					{
						_id: 'appearance',
						route: '/#/settings/application/appearance',
						label: hardData.sections[10],
						info: hardData.imperatives[34],
						onActivate: function() {
							$rootScope.globalFormModels.appConfigModel.set();
						}
					},
					{
						_id: 'regional',
						route: '/#/settings/application/regional',
						label: hardData.sections[9],
						info: hardData.description[5],
						onActivate: function() {
							$rootScope.globalFormModels.appConfigModel.set();
						}
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
						info: hardData.description[3],
						onActivate: function() {
							$rootScope.globalFormModels.personalDetailsModel.set();
						}
					},
					{
						_id: 'password',
						route: '/#/settings/account/password',
						label: hardData.labels[2],
						info: hardData.description[4],
						onActivate: function() {
							$rootScope.globalFormModels.passwordModel.clear();
						}
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
						info: hardData.warnings[4],
						onActivate: function() {
							$rootScope.globalFormModels.deactivationModel.clear();
						}
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



	startTabsConf.$inject = ['$rootScope', 'hardDataService'];
	settingsTabsConf.$inject = ['$rootScope', 'hardDataService'];
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
		$rootScope, $scope, $window, $timeout, $moment, $state, storageService, authService, hardDataService, ui,
		uiSetupService, socketService, myClass, Restangular
	) {

		socketService.init();

		$rootScope.ui = ui;
		$rootScope.hardData = hardDataService.get();
		$rootScope.Math = window.Math;

		$rootScope.apiData = {
			loggedInUser: undefined,
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

		$rootScope.globalFormModels = {
			userModel: new myClass.MyFormModel(
				'userModel',
				['email', 'username', 'password', 'firstname', 'lastname', 'countryFirstLetter', 'country'],
				false
			),
			appConfigModel: new myClass.MyFormModel(
				'appConfigModel',
				['userId', 'language', 'theme'],
				true
			),
			personalDetailsModel: new myClass.MyFormModel(
				'personalDetailsModel',
				['_id', 'email', 'username', 'firstname', 'lastname', 'countryFirstLetter', 'country', 'registration_date'],
				true
			),
			passwordModel: new myClass.MyFormModel(
				'passwordModel',
				['currentPassword', 'password'],
				false
			),
			deactivationModel: new myClass.MyFormModel(
				'deactivationModel',
				['deactivationReasonId'],
				false
			),
			reportSearchModel: new myClass.MyFormModel(
				'reportSearchModel',
				['title', 'categoryId', 'subcategoryId'],
				true
			)
		};



		$rootScope.logout = function(extraParams, cb) {

			// Resetting ui ctrls
			uiSetupService.reInitCtrls(ui);

			// Resetting form models
			$rootScope.resetGlobalFormModels();

			authService.setAsLoggedOut(function() {
				var params = { tab: 'login' };
				if (extraParams) { Object.assign(params, extraParams); }
				$state.go('app.start', params);
				if (cb) { cb(); }
			});
		};

		$rootScope.resetGlobalFormModels = function() {

			var modelKeys = Object.keys($rootScope.globalFormModels);
			for (var i = 0; i < modelKeys.length; i++) { $rootScope.globalFormModels[modelKeys[i]].set({}); }
		};

		$rootScope.$watch(function() { return storageService.authToken.getValue(); }, function(newValue) {

			Restangular.setDefaultHeaders({ 'x-access-token': newValue });

			// When token is gone but user still logged in then the app will reload
			if (!newValue && authService.state.loggedIn) { $window.location.reload(); }
		});
	};

	AppController.$inject = [
		'$rootScope', '$scope', '$window', '$timeout', '$moment', '$state', 'storageService', 'authService',
		'hardDataService', 'ui', 'uiSetupService', 'socketService', 'myClass', 'Restangular'
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

	var ProfileController = function($rootScope, $scope, contextMenuConf, reportsConf, MySwitchable) {

		$scope.profileCollectionBrowser = reportsConf.profileCollectionBrowser;
		$scope.profileReportsContextMenu = new MySwitchable(contextMenuConf.profileReportsContextMenu);
	};

	ProfileController.$inject = ['$rootScope', '$scope', 'contextMenuConf', 'reportsConf', 'MySwitchable'];
	angular.module('appModule').controller('ProfileController', ProfileController);

})();
(function() {

	'use strict';

	var ReportController = function($scope, $stateParams, reportsService, contextMenuConf, commentsConf, MySwitchable) {

		$scope.params = $stateParams;

		$scope.$watch('apiData.report', function(report) {

			if (report && report._isOwn()) {
				$scope.reportContextMenu = new MySwitchable(contextMenuConf.reportContextMenuConf);
				$scope.reportContextMenu.data = report;

			} else {
				$scope.reportContextMenu = null;
			}
		});

		$scope.reportsService = reportsService;
		$scope.commentsBrowser = commentsConf.reportCommentsBrowser;
	};

	ReportController.$inject = ['$scope', '$stateParams', 'reportsService', 'contextMenuConf', 'commentsConf', 'MySwitchable'];
	angular.module('appModule').controller('ReportController', ReportController);

})();
(function() {

	'use strict';

	var SearchController = function($rootScope, $scope, $timeout, reportsConf, googleMapService) {

		$scope.searchCollectionBrowser = reportsConf.searchCollectionBrowser;
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

	var SettingsController = function($scope, ui) {

		$scope.$watch('ui.listGroups.settings.activeSwitcherId', function(newValue) {
			if (angular.isDefined(newValue)) { $scope.activeTabs = ui.tabs[newValue]; }
		});
	};

	SettingsController.$inject = ['$scope', 'ui'];
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
			onEnter: function(ui) {

				ui.menus.top.activateSwitcher('newreport');
				ui.frames.main.activateSwitcher('newreport');
				ui.frames.app.activateSwitcher('main');
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
				getUser: function(isAuthenticated, $state, $stateParams, $q, UsersRest, ui) {

					return $q(function(resolve, reject) {

						UsersRest.getList({ _id: $stateParams.id }).then(function(res) {
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
			}
		});
	});

})();
(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.report', {
			url: '/report?id&edit',
			views: {
				tab: {
					templateUrl: 'public/pages/lost-and-found-app-report-tab.html'
				}
			},
			resolve: {
				isAuthenticated: function(authentication, resolveService, $state) {
					return resolveService.isAuthenticated($state.current.name);
				},
				apiData: function(isAuthenticated, $q, $rootScope, $state, $stateParams, $timeout, UsersRest, ReportsRest, authService, ui) {

					return $q(function(resolve, reject) {

						if (authService.state.authenticated) {

							var promises = [];

							promises.push(UsersRest.getList({ reportId: $stateParams.id }));
							promises.push(ReportsRest.getList({ _id: $stateParams.id, subject: 'report' }));

							$q.all(promises).then(function(results) {
								$timeout(function() { resolve(true); });

							}, function() {
								reject();
								$state.go('app.home');
							});

						} else { reject(); }
					});
				}
			},
			onEnter: function(apiData, $rootScope, $timeout, $stateParams, googleMapService, ui) {

				if (apiData) {

					if ($stateParams.edit === '1') {
						$rootScope.$broadcast('editReport', { report: $rootScope.apiData.report });

					} else {
						googleMapService.singleReportMap.init($rootScope.apiData.report);
					}

					$timeout(function() {
						ui.menus.top.activateSwitcher();
						ui.frames.main.activateSwitcher('report');
						ui.frames.app.activateSwitcher('main');
					});
				}
			}
		});
	});

})();
(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.report.tab', {
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

								$timeout(function() {
									$state.go('app.settings1', {}, { location: 'replace' });
								});

							} else if (!results[1]) {

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

	    			}).then(function() {

	    				// Resolve

	    				ui.tabs.start.activateSwitcher($stateParams.tab);
						ui.frames.main.activateSwitcher();
						ui.frames.app.activateSwitcher('start');
	    				ui.listGroups.settings.getFirstSwitcher().activate();

						angular.forEach(ui.listGroups.settings.switchers, function(switcher) {
							ui.tabs[switcher._id].getFirstSwitcher().activate();
						});

	    			}, function(redirectTab) {

	    				// Reject
	    				$timeout(function() {
							$state.go('app.start', { tab: redirectTab }, { location: 'replace' });
						});
	    			});
				}
			},
			onEnter: function($rootScope, $stateParams, $timeout, ui) {

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

					return $q(function(resolve) {

						if (!$stateParams.id) {

							if (authService.state.authenticated) {
								$state.go('app.upgrade', { id: $rootScope.apiData.loggedInUser._id }, { location: 'replace' });

							} else {
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
			}
		});
	});

})();
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

				var category = _.find($rootScope.hardData.reportCategories, function(obj) {
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

							UsersRest.post({ authToken: authToken }).then(function(res) {

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

				var appConfig = $rootScope.apiData.loggedInUser.appConfig;

				if (appConfig.language != sessionConst.language || appConfig.theme != sessionConst.theme) {
					$window.location.reload();

				} else {

					// Setting models values
					$rootScope.globalFormModels.personalDetailsModel.set($rootScope.apiData.loggedInUser);
					$rootScope.globalFormModels.appConfigModel.set($rootScope.apiData.loggedInUser.appConfig);

					if (cb) { cb(); }
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
			api: 'http://api.fixer.io/latest?base=',
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

		service.geo = {
			allowed: undefined
		};

		service.singleReportMap = {
			init: function(report) {

				var geocoder = new google.maps.Geocoder();
				var map = new google.maps.Map(document.getElementById('reportMap'));
				var latLng = new google.maps.LatLng(report.startEvent.geolocation.lat, report.startEvent.geolocation.lng);

				google.maps.event.addListener(map, 'idle', function() {
					google.maps.event.trigger(map, 'resize');
				});

				geocoder.geocode({ 'placeId': report.startEvent.placeId }, function(results, status) {

					$timeout(function() {

						var infowindow = new google.maps.InfoWindow();

						map.setCenter(latLng);
						map.setZoom(13);

						var marker = new google.maps.Marker({
							map: map,
							position: latLng
						});

						marker.addListener('mouseover', function() {
							infowindow.setContent(results[0].formatted_address);
							infowindow.open(map, marker);
						});

						marker.addListener('mouseout', function() {
							infowindow.close();
						});

					}, 1000);
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
							service.searchReportsMap.addMarkers(reportsConf.searchCollectionBrowser.collection);
						}
					});

				} else {

					google.maps.event.trigger(service.searchReportsMap.ins, 'resize');
				}
			},
			addMarkers: function(collection) {

				if (angular.isDefined(service.geo.allowed)) {

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
				var iconName = collection[i].startEvent.group == 'lost' ? 'red-dot.png' : 'blue-dot.png';

				var newMarker = new google.maps.Marker({
					map: service.searchReportsMap.ins,
					position: new google.maps.LatLng(collection[i].startEvent.geolocation.lat, collection[i].startEvent.geolocation.lng),
					icon: 'http://maps.google.com/mapfiles/ms/icons/' + iconName
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

				// console.log(captchaObj);

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

			service.socket = io('http://localhost:8080');
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
		MySwitchable, MySwitcher, MyLoader, MyModal, MySrc, MyStorageItem, MyFormModel, MyCollectionBrowser,
		MySrcCollection, MyForm, MySrcAction
	) {

		return {
			MySwitchable: MySwitchable,
			MySwitcher: MySwitcher,
			MyLoader: MyLoader,
			MyModal: MyModal,
			MySrc: MySrc,
			MyStorageItem: MyStorageItem,
			MyFormModel: MyFormModel,
			MyCollectionBrowser: MyCollectionBrowser,
			MySrcCollection: MySrcCollection,
			MyForm: MyForm,
			MySrcAction: MySrcAction
		};
	};

	myClass.$inject = [
		'MySwitchable', 'MySwitcher', 'MyLoader', 'MyModal', 'MySrc', 'MyStorageItem', 'MyFormModel',
		'MyCollectionBrowser', 'MySrcCollection', 'MyForm', 'MySrcAction'
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

			// Creating loader
			this.loader = new MyLoader();
		};

		MyCollectionBrowser.prototype.init = function(cb) {

			var that = this;

			that.loader.start(false, function() {

				// Fetching collection to display

				try {

					that.fetchData(that.createFetchQuery()).then(function(res) {

						// Initializing pager ctrl

						if (that.noPager) { that.meta.count = that.collection.length; }
						that.refresher = {};

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
						that.loader.stop(function() { if (cb) { cb(true); } });

					}, function(res) {

						that.flush();
						that.loader.stop(function() { if (cb) { cb(false); } });
					});

				} catch (ex) {

					that.flush();
					that.loader.stop(function() { if (cb) { cb(false); } });
				}
			});
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

	var MyDataModel = function() {

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
			clear: function(onlyErrors) {

				var goThrough = function(obj) {

					for (var prop in obj) {

						if (obj.hasOwnProperty(prop)) {

							if (obj[prop] instanceof MyDataModelValue) {

								if (!onlyErrors) {
									obj[prop] = new MyDataModelValue();


								} else {
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
								toBeSetObj[prop].error.message = obj[prop].message;

							} else {
								goThrough(obj[prop], toBeSetObj[prop]);
							}
						}
					}
				};

				goThrough(errors, this);
				if (cb) { cb(); }
			},
			clearErrors: function(cb) {

				this.clear(true);
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
		}

		return MyDataModel;
	};

	MyDataModel.$inject = [];
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
									that.model.bindErrors(res.data.errors, function() {
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

			this.model.clear();
		};

		MyForm.prototype.reset = function() {

			this.model.clear();
			this.model.set();
		};

		return MyForm;
	};

	MyForm.$inject = ['$rootScope', '$window', '$timeout', 'grecaptchaService'];
	angular.module('appModule').factory('MyForm', MyForm);

})();
(function() {

	'use strict';

	var MyFormModel = function($timeout) {

		var MyFormModelValue = function(value, error, errorType) {

			this.value = value;
			this.error = error;
			this.errorType = errorType;
		};

		var MyFormModel = function(_id, keys, allowUseDefaults) {

			this._id = _id;
			this.keys = keys;
			this.allowUseDefaults = allowUseDefaults;

			this.values = {};
			this.defaults = undefined;

			this.clear();
		};

		MyFormModel.prototype = {
			set: function(freshValues) {

				var that = this;
				var tempValues;

				// Setting with fresh values
				if (typeof freshValues == 'object') {

					// Fresh values have values
					if (!_.isEmpty(freshValues)) {

						if (that.allowUseDefaults) { that.defaults = freshValues; }
						tempValues = freshValues;

					// Fresh values are empty
					} else { that.clear(); }

				// Setting with defaults
				} else if (this.allowUseDefaults && that.defaults) {

					tempValues = that.defaults;
				}

				// Setting values
				if (tempValues) {

					angular.forEach(that.keys, function(key) {

						if (angular.isDefined(tempValues[key])) {
							that.values[key].value = tempValues[key];

						} else {
							that.values[key] = new MyFormModelValue(null, null, null);
						}
					});
				}
			},
			setValue: function(key, value) {

				this.values[key] = new MyFormModelValue(value, null, null);
			},
			setWithRestObj: function(restObj) {

				var that = this;
				var freshValues = {};

				angular.forEach(that.keys, function(key) {
					freshValues[key] = restObj[key];
				});

				that.set(freshValues);
			},
			setRestObj: function(restObj, cb) {

				var that = this;

				angular.forEach(that.keys, function(key) {
					restObj[key] = that.values[key].value;
				});

				if (cb) { cb(); }
			},
			clear: function() {

				var that = this;

				angular.forEach(that.keys, function(key) {
					that.values[key] = new MyFormModelValue(null, null, null);
				});
			},
			trimValues: function(formId, cb) {

				var that = this;

				angular.forEach(that.keys, function(key) {

					if (typeof that.values[key].value != 'number') {

						var htmlCtrl = $('#' + formId + ' #' + key);

						if (htmlCtrl.length > 0) {

							var value = $(htmlCtrl).val();

							if (value) {
								var trimmed = value.trim();
								that.values[key].value = trimmed;
								$(htmlCtrl).val(trimmed);

							} else {
								that.values[key].value = null;
							}
						}
					}
				});

				if (cb) { cb(); }
			},
			bindErrors: function(errors, cb) {

				var that = this;

				// When errors defined
				if (angular.isDefined(errors)) {

					// Going through all model keys
					angular.forEach(that.keys, function(key) {

						// When error for particular model field defined
						if (errors[key]) {

							that.values[key].errorType = errors[key].kind;
							that.values[key].error = errors[key].message;

						} else {
							that.values[key].errorType = null;
							that.values[key].error = null;
						}
					});

					if (cb) { cb(); }

				} else { if (cb) { cb(); } }
			},
			clearErrors: function(cb) {

				var that = this;

				angular.forEach(that.keys, function(key) {

					that.values[key].error = null;
					that.values[key].errorType = null;
				});

				if (cb) { cb(); }
			},
			getValue: function(key) {

				return this.values[key].value;
			},
			getValues: function() {

				var that = this;
				var values = {};

				angular.forEach(that.keys, function(key) {
					values[key] = that.values[key].value;
				});

				return values;
			}
		};

		return MyFormModel;
	};

	MyFormModel.$inject = ['$timeout'];
	angular.module('appModule').factory('MyFormModel', MyFormModel);

})();
(function() {

	'use strict';

	var MyLoader = function($timeout) {

		var MyLoader = function() {

			this.isLoading = false;
		};

		MyLoader.prototype.minLoadTime = 500;

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

		var minLoadTime = 500;

		var MySrc = function(conf) {

			if (conf) {

				this.defaultUrl = conf.defaultUrl;
				this.constructUrl = conf.constructUrl;
				this.uploadRequest = conf.uploadRequest;
				this.removeRequest = conf.removeRequest;
			}

			this.loader = new MyLoader();
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
				$timeout(function() { that.url = url; }, minLoadTime);

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

		MySrc.prototype.update = function(args, preventReload, i) {

			var that = this;

			return $q(function(resolve) {

				that.loader.start(false, function() {

					// Running external procedure
					that.uploadRequest(args, i).then(function(result) {

						if (result.success) {

							if (!preventReload) {
								that.load(result.url, true);

							} else {
								that.loader.stop();
							}

							resolve(true);

						} else {

							that.loader.stop();
							resolve(false);
						}
					});
				});
			});
		};

		MySrc.prototype.remove = function(args, doLoadSecondary) {

			var that = this;
			if (!args) { args = {}; }

			return $q(function(resolve) {

				that.loader.start(false, function() {

					args._id = that._id;

					// Running external procedure
					that.removeRequest(args).then(function(success) {

						if (success) {
							if (doLoadSecondary) {
								that.loadSecondary();
							}

						} else {
							that.loader.stop();
						}

						resolve(success);
					});
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

	var MySrcAction = function($rootScope, $q) {

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

			var username = $rootScope.globalFormModels.personalDetailsModel.getValue('username');

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

	MySrcAction.$inject = ['$rootScope', '$q'];
	angular.module('appModule').factory('MySrcAction', MySrcAction);

})();
(function() {

	'use strict';

	var MySrcCollection = function($rootScope, $q, MyCollectionSelector, MySrc, MyLoader) {

		var MySrcCollection = function(conf) {

			Object.assign(MySrcCollection.prototype, MyCollectionSelector.prototype);

			if (conf) {

				this.remove = conf.remove;

				this.srcArgs = {
					defaultUrl: conf.defaultUrl,
					constructUrl: conf.constructUrl,
					uploadRequest: conf.uploadRequest,
					removeRequest: conf.removeRequest
				};
			}

			this.collection = [];
			this.loader = new MyLoader();
		};

		MySrcCollection.prototype.init = function(collection, cb) {

			var that = this;

			// When there is some init data
			if (collection.length > 0) {

				that.loader.start(false, function() {

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
						loadPromises.push(that.collection[i].load(src.constructUrl(i)));
					}

					// Returning all loading finished promises
					$q.all(loadPromises).then(function(results) {
						that.loader.stop();
						if (cb) { cb(results); }
					});
				});

			} else {

				// Emptying collection array
				that.collection.length = 0;

				if (cb) { cb(); }
			}
		};

		MySrcCollection.prototype.updateSingle = function(args, cb) {

			var that = this;

			// Creating new src
			var newSrc = new MySrc(that.srcArgs);
			newSrc.index = args.src.index;

			// Replacing in new array
			that.collection[newSrc.index] = newSrc;

			// Updating
			newSrc.uploadRequest(args, undefined, 0).then(function(result) {

				// If error while updating
				if (!result) {

					// Setting new src back to old one
					that.collection[src.index] = src;
				}

				if (cb) { cb(result); }
			});
		};

		MySrcCollection.prototype.addToSet = function(args, cb) {

			var that = this;

			that.loader.start(false, function() {

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
						updatePromises.push(src.uploadRequest(args, i, Number(i)));
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

					if (cb) { cb(results); }
				});
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
					title: $rootScope.hardData.labels[28],
					acceptCb: function() {

						that.loader.start(false, function() {

							var indexes = [];

							// For all srcs to delete
							for (var i in args.collection) {
								indexes.push(args.collection[i].index);
							}

							// Running external procedure
							that.remove(indexes).then(function(res) {

								// When success
								if (cb) { cb(true, res.data); }

							}, function(res) {

								// When failure
								if (cb) { cb(false, res.data); }
							});
						});
					},
					hideCb: function() {
						if (cb) { cb(); }
					}
				});
			}
		};

		MySrcCollection.prototype.moveSingle = function(direction, src, cb) {

			var that = this;

			if (that.collection.length > 1) {

				that.loader.start(false, function() {

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

					for (var i in that.collection) {
						that.collection[i].index = Number(i);
					}

					if (cb) { cb(); }
				});
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



		MySwitcher.prototype.activate = function(skipOnActivatedCb) {

			this.parent.activeSwitcherId = this._id;
			if (!skipOnActivatedCb && this.onActivate) { this.onActivate(); }
		};



		return MySwitcher;
	};



	MySwitcher.$inject = [];
	angular.module('appModule').factory('MySwitcher', MySwitcher);

})();
(function() {

	'use strict';

	var AppConfigsRest = function(Restangular) {
		return Restangular.service('app_configs');
	};

	AppConfigsRest.$inject = ['Restangular'];
	angular.module('appModule').factory('AppConfigsRest', AppConfigsRest);

})();
(function() {

	'use strict';

	var CommentsRest = function(Restangular) {
		return Restangular.service('comments');
	};

	CommentsRest.$inject = ['Restangular'];
	angular.module('appModule').factory('CommentsRest', CommentsRest);

})();
(function() {

	'use strict';

	var ContactTypesRest = function(Restangular, storageService) {

		var contactTypes = Restangular.service('contact_types');
		return contactTypes;
	};

	ContactTypesRest.$inject = ['Restangular', 'storageService'];
	angular.module('appModule').factory('ContactTypesRest', ContactTypesRest);

})();
(function() {

	'use strict';

	var DeactivationReasonsRest = function(Restangular) {
		return Restangular.service('deactivation_reasons');
	};

	DeactivationReasonsRest.$inject = ['Restangular'];
	angular.module('appModule').factory('DeactivationReasonsRest', DeactivationReasonsRest);

})();
(function() {

	'use strict';

	var PaymentsRest = function(Restangular) {
		return Restangular.service('payments');
	};

	PaymentsRest.$inject = ['Restangular'];
	angular.module('appModule').factory('PaymentsRest', PaymentsRest);

})();
(function() {

	'use strict';

	var UsersRest = function($rootScope, Restangular) {

		var users = Restangular.service('users');

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

	UsersRest.$inject = ['$rootScope', 'Restangular'];
	angular.module('appModule').factory('UsersRest', UsersRest);

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('formActionBtns', function() {

		var formActionBtns = {
			restrict: 'E',
			templateUrl: 'public/directives/^/btns/formActionBtns/formActionBtns.html',
			transclude: true,
			scope: {
				myForm: '='
			},
			controller: function($scope) {

				var clearBtnForms = [
					'loginForm', 'registerForm', 'recoverForm', 'passwordForm', 'deactivationForm', 'reportSearchForm',
					'contactForm', 'editReportForm', 'newReportForm', 'commentForm', 'upgradeForm'
				];

				var resetBtnForms = ['regionalForm', 'appearanceForm', 'personalDetailsForm', 'editReportForm', 'newReportForm', 'upgradeForm'];

				var cancelBtnForms = ['editReportForm', 'newReportForm'];

				$scope.myForm.showClearBtn = clearBtnForms.indexOf($scope.myForm.ctrlId) > -1;
				$scope.myForm.showResetBtn = resetBtnForms.indexOf($scope.myForm.ctrlId) > -1;
				$scope.myForm.showCancelBtn = cancelBtnForms.indexOf($scope.myForm.ctrlId) > -1;

				switch ($scope.myForm.ctrlId) {

					case 'editReportForm':
					case 'newReportForm':
						$scope.myForm.submitBtnPhraseIndex = 4;
						break;

					case 'loginForm':
					case 'registerForm':
					case 'recoverForm':
					case 'commentForm':
						$scope.myForm.submitBtnPhraseIndex = 3;
						break;

					case 'contactForm':
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



	appModule.directive('scrollTopBtn', function() {

		var scrollTopBtn = {
			restrict: 'E',
			templateUrl: 'public/directives/^/btns/scrollTopBtn/scrollTopBtn.html',
			controller: function($scope) {

				$scope.scroll = function() {
					$('html, body').animate({ scrollTop: 0 }, 'fast');
				};
			}
		};

		return scrollTopBtn;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('appearanceForm', function($rootScope, AppConfigsRest, MyForm, Restangular) {

		var appearanceForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/appearanceForm/appearanceForm.html',
			scope: true,
			controller: function($scope) {

				var formModel = $rootScope.globalFormModels.appConfigModel;

				$scope.myForm = new MyForm({
					ctrlId: 'appearanceForm',
					model: formModel,
					reload: true,
					submitAction: function(args) {

						formModel.setValue('userId', $rootScope.globalFormModels.personalDetailsModel.getValue('_id'));
						var restCopy = Restangular.copy($rootScope.apiData.loggedInUser.appConfig);
						formModel.setRestObj(restCopy);
						return restCopy.put();
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

	appModule.directive('contactForm', function($rootScope, $http, $timeout, ContactTypesRest, myClass) {

		var contactForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/contactForm/contactForm.html',
			scope: true,
			controller: function($scope) {

				var formModel = new myClass.MyFormModel('contactForm', ['contactType', 'contactMsg'], false);

				$scope.myForm = new myClass.MyForm({
					ctrlId: 'contactForm',
					model: formModel,
					submitAction: function(args) {

						return ContactTypesRest.post(formModel.getValues());
					},
					submitSuccessCb: function(res) {

						formModel.clear();
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



	appModule.directive('deactivationForm', function($rootScope, $timeout, $filter, ui, DeactivationReasonsRest, myClass) {

		var deactivationForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/deactivationForm/deactivationForm.html',
			scope: true,
			controller: function($scope) {

				var formModel = $rootScope.globalFormModels.deactivationModel;

				$scope.myForm = new myClass.MyForm({
					ctrlId: 'deactivationForm',
					model: formModel,
					submitAction: function(args, cb) {

						return $rootScope.apiData.loggedInUser.remove(formModel.getValues());
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



	appModule.directive('loginForm', function($rootScope, $timeout, $state, authService, MyForm, UsersRest) {

		var loginForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/loginForm/loginForm.html',
			scope: true,
			controller: function($scope) {

				var formModel = $rootScope.globalFormModels.userModel;

				$scope.myForm = new MyForm({
					ctrlId: 'loginForm',
					model: formModel,
					submitAction: function(args) {

						var body = {
							username: formModel.getValue('username'),
							password: formModel.getValue('password'),
						};

						return UsersRest.post(body, undefined, { captcha_response: args.captchaResponse });
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



	appModule.directive('passwordForm', function($rootScope, MyForm, Restangular) {

		var passwordForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/passwordForm/passwordForm.html',
			scope: true,
			controller: function($scope) {

				var formModel = $rootScope.globalFormModels.passwordModel;

				$scope.myForm = new MyForm({
					ctrlId: 'passwordForm',
					model: formModel,
					submitAction: function(args) {

						var copy = Restangular.copy($rootScope.apiData.loggedInUser);
						copy.currentPassword = formModel.getValue('currentPassword');
						copy.password = formModel.getValue('password');
						return copy.put();
					},
					submitSuccessCb: function(res) {

						formModel.clear();
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



	appModule.directive('recoverForm', function($rootScope, $http, MyForm) {

		var recoverForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/recoverForm/recoverForm.html',
			scope: true,
			controller: function($scope) {

				var formModel = $rootScope.globalFormModels.userModel;

				$scope.myForm = new MyForm({
					ctrlId: 'recoverForm',
					model: formModel,
					submitAction: function(args) {

						return $http.post('/recover', { email: formModel.getValue('email') }, {
							headers: { captcha_response: args.captchaResponse }
						});
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



	appModule.directive('personalDetailsForm', function($rootScope, MyForm, Restangular) {

		var personalDetailsForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/personalDetailsForm/personalDetailsForm.html',
			scope: true,
			controller: function($scope) {

				$scope.countries = $rootScope.localData.countries;

				$scope.myForm = new MyForm({
					ctrlId: 'personalDetailsForm',
					model: $rootScope.globalFormModels.personalDetailsModel,
					submitAction: function(args) {

						var copy = Restangular.copy($rootScope.apiData.loggedInUser);
						$scope.myForm.model.setRestObj(copy);
						return copy.put();
					}
				});
			}
		};

		return personalDetailsForm;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('regionalForm', function($rootScope, AppConfigsRest, MyForm, Restangular) {

		var regionalForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/regionalForm/regionalForm.html',
			scope: true,
			controller: function($scope) {

				var formModel = $rootScope.globalFormModels.appConfigModel;

				$scope.myForm = new MyForm({
					ctrlId: 'regionalForm',
					model: formModel,
					reload: true,
					submitAction: function(args) {

						formModel.setValue('userId', $rootScope.globalFormModels.personalDetailsModel.getValue('_id'));
						var restCopy = Restangular.copy($rootScope.apiData.loggedInUser.appConfig);
						formModel.setRestObj(restCopy);
						return restCopy.put();
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
			templateUrl: 'public/directives/^/forms/registerForm/registerForm.html',
			scope: true,
			controller: function($scope) {

				$scope.countries = $rootScope.localData.countries;

				var formModel = $rootScope.globalFormModels.userModel;

				$scope.myForm = new MyForm({
					ctrlId: 'registerForm',
					model: formModel,
					submitAction: function(args) {

						return UsersRest.post(formModel.getValues(), undefined, { captcha_response: args.captchaResponse });
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

		return registerForm;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('reportForm', function($rootScope, $timeout, $state, myClass, reportsService, Restangular) {

		var reportForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/reportForm/reportForm.html',
			scope: {
				action: '@'
			},
			controller: function($scope) {

				$scope.ui = $rootScope.ui;
				$scope.apiData = $rootScope.apiData;
				$scope.hardData = $rootScope.hardData;

				$scope.autocomplete = {};

				var date = new Date();
				$scope.maxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
				$scope.minDate = new Date(2000, 0, 1);

				$scope.myModel = new myClass.MyFormModel('reportFormModel', reportsService.formModelFields, true);
				$scope.myModel.set({ date: $scope.maxDate });

				$scope.myForm = new myClass.MyForm({
					ctrlId: $scope.action + 'Form',
					model: $scope.myModel,
					submitAction: reportsService.getFormSubmitAction($scope),
					onCancel: function() {

						$timeout(function() { $scope.myForm.reset(); });
						window.history.back();
					}
				});
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					switch (scope.action) {

						case 'editReport':

							if (!$rootScope.$$listeners.editReport) {
								$rootScope.$on('editReport', function(e, args) {
									if (args.report) {

										var geocoder = new google.maps.Geocoder();

										geocoder.geocode({ 'placeId': args.report.startEvent.placeId }, function(results, status) {

											scope.myModel.set({
												title: args.report.title,
												categoryId: args.report.categoryId,
												subcategoryId: args.report.subcategoryId,
												subsubcategoryId: args.report.subsubcategoryId,
												serialNo: args.report.serialNo,
												description: args.report.description,
												group: args.report.startEvent.group,
												date: args.report.startEvent.date,
												geolocation: results[0].formatted_address,
												details: args.report.startEvent.details
											});
										});
									}
								});
							}

							scope.$on('$destroy', function() {
								$rootScope.$$listeners.editReport = null;
							});

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

	var appModule = angular.module('appModule');



	appModule.directive('reportSearchForm', function($rootScope, myClass) {

		var reportSearchForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/reportSearchForm/reportSearchForm.html',
			scope: true,
			controller: function($scope) {

				$scope.reportCategories = $rootScope.hardData.reportCategories;

				$scope.myForm = new myClass.MyForm({
					ctrlId: 'reportSearchForm',
					noLoader: true,
					model: $rootScope.globalFormModels.reportSearchModel,
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
			templateUrl: 'public/directives/^/forms/upgradeForm/upgradeForm.html',
			scope: {},
			controller: function($scope) {

				$scope.hardData = hardDataService.get();
				$scope.currentYear = CURRENT_YEAR;

				var fields = [
					'paymentMethod',
					'creditCardType',
					'creditCardNumber',
					'creditCardExpireMonth',
					'creditCardExpireYear',
					'cvv2',
					'firstname',
					'lastname',
					'amount',
					'currency'
				];

				$scope.myModel = new myClass.MyFormModel('upgradePaymentModel', fields, true);

				$scope.myModel.set({
					paymentMethod: 'credit_card',
					currency: DEFAULT_CURRENCY,
					amount: DEFAULT_AMOUNT,
					creditCardExpireMonth: 1,
					creditCardExpireYear: CURRENT_YEAR
				});

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

						console.log(res);
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

					scope.$watch('myModel.values.currency.value', function(newCurrency, oldCurrency) {

						if (newCurrency != oldCurrency) {
							scope.myModel.setValue('amount', amounts[newCurrency]);
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

	appModule.directive('confirmDangerModal', function() {

		var confirmDangerModal = {
			restrict: 'E',
			templateUrl: 'public/directives/^/modals/confirmDangerModal/confirmDangerModal.html',
			scope: {
				ins: '='
			}
		};

		return confirmDangerModal;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('confirmModal', function() {

		var confirmModal = {
			restrict: 'E',
			templateUrl: 'public/directives/^/modals/confirmModal/confirmModal.html',
			scope: {
				ins: '='
			}
		};

		return confirmModal;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('infoModal', function() {

		var infoModal = {
			restrict: 'E',
			templateUrl: 'public/directives/^/modals/infoModal/infoModal.html',
			scope: {
				ins: '='
			}
		};

		return infoModal;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('appStats', function($rootScope) {

		var appStats = {
			restrict: 'E',
			templateUrl: 'public/directives/^/tables/appStats/appStats.html',
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

	appModule.directive('imgCropWindow', function($rootScope, $window, $timeout, MySrcAction, MyModal, MyLoader, NUMS) {

		var imgId = '#cropImg';
		var inputId = '#cropInput';

		var flushCropper = function(scope) {

			$(inputId).val(undefined);
			$(imgId).cropper('destroy');
			$(imgId).attr('src', '');
			scope.selectedFile = undefined;
		};

		var imgCropWindow = {
			restrict: 'E',
			templateUrl: 'public/directives/^/windows/imgCropWindow/imgCropWindow.html',
			scope: {},
			controller: function($scope) {

				var srcAction = new MySrcAction({
					acceptedFiles: 'image/png,image/jpg,image/jpeg',
					maxFileSize: NUMS.photoMaxSize
				});

				$scope.modalWindow = new MyModal({ id: 'imgCropModal', title: $rootScope.hardData.sections[19] });
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
									$timeout(function() { $scope.loader.stop(); }, MyLoader.prototype.minLoadTime);
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
					scope.$on('displayImgCropWindow', function(e, args) {

						flushCropper(scope);

						// Showing modal
						scope.modalWindow.show({
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

		return imgCropWindow;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('auctionNumBox', function($rootScope, $sce, exchangeRateService) {

		var auctionNumBox = {
			restrict: 'E',
			templateUrl: 'public/directives/AUCTION/auctionNumBox/auctionNumBox.html',
			scope: {
				auction: '=auction'
			},
			controller: function($scope) {

				$scope.hardData = $rootScope.hardData;
				$scope.exchangeRateService = exchangeRateService;

				$scope.numValues = [
					{ name: 'initialValue', message: '' },
					{ name: 'bidIncrement', message: '' },
					{ name: 'minSellPrice', message: '' }
				];
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					scope.$watch(function() { return scope.auction; }, function(auction) {

						if (auction) {

							var rates = exchangeRateService.config.availableRates;

							for (var i in scope.numValues) {

								var message = '';

								for (var rateKey in rates) {
									if (rateKey != scope.auction.currency) {
										var value = exchangeRateService.methods.convert(scope.auction[scope.numValues[i].name], scope.auction.currency, rateKey);
										message += value + '<br />';
									}
								}

								scope.numValues[i].message = $sce.trustAsHtml(message);
							}
						}
					});
				};
			}
		};

		return auctionNumBox;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('comments', function($rootScope, commentsConf, myClass, CommentsRest) {

		var comments = {
			restrict: 'E',
			templateUrl: 'public/directives/COMMENT/comments/comments.html',
			scope: {
				ctrlId: '@'
			},
			controller: function($scope) {

				$scope.apiData = $rootScope.apiData;
				$scope.hardData = $rootScope.hardData;

				$scope.myForm = new myClass.MyForm({
					ctrlId: 'commentForm',
					model: new myClass.MyFormModel('commentModel', ['userId', 'content'], false),
					submitAction: function(args) {

						var userId = $rootScope.globalFormModels.personalDetailsModel.getValue('_id');
						$scope.myForm.model.setValue('userId', userId);
						return CommentsRest.post($scope.myForm.model.getValues(), { reportId: $rootScope.apiData.report._id });
					},
					submitSuccessCb: function(res) {

						$scope.myForm.model.clear();
						$rootScope.$broadcast('initReportComments');
					}
				});

				$scope.init = function() {

					$scope.collectionBrowser = commentsConf.reportCommentsBrowser;
					$scope.commentContextMenuConf = commentsConf.commentContextMenuConf;

					$scope.collectionBrowser.init();
				};

				if (!$scope.collectionBrowser) { $scope.init(); }
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					if (!$rootScope.$$listeners['init' + scope.ctrlId]) {
						$rootScope.$on('init' + scope.ctrlId, function(e, args) {
							scope.init();
						});
					}

					scope.$on('$destroy', function() {
						$rootScope.$$listeners['init' + scope.ctrlId] = null;
					});
				};
			}
		};

		return comments;
	});

})();
(function() {

	'use strict';

	var commentsConf = function($rootScope, hardDataService, CommentsRest, myClass) {

		var hardData = hardDataService.get();

		this.commentContextMenuConf = {
			icon: 'glyphicon glyphicon-option-horizontal',
			switchers: [
				{
					_id: 'edit',
					label: hardData.imperatives[33],
					onClick: function() {

					}
				},
				{
					_id: 'delete',
					label: hardData.imperatives[14],
					onClick: function() {

						this.parent.data.remove({ reportId: $rootScope.apiData.report._id }).then(function() {
							$rootScope.$broadcast('initReportComments');
						});
					}
				}
			]
		};

		this.reportCommentsBrowser = new myClass.MyCollectionBrowser({
			singlePageSize: 10,
			fetchData: function(query) {

				if ($rootScope.apiData.report) {
					query.reportId = $rootScope.apiData.report._id;
					return CommentsRest.getList(query);
				}
			}
		});

		return this;
	};

	commentsConf.$inject = ['$rootScope', 'hardDataService', 'CommentsRest', 'myClass'];
	angular.module('appModule').service('commentsConf', commentsConf);

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myAlert', function() {

		var myAlert = {
			restrict: 'E',
			template: '<div class="myAlert alert no_selection" ng-class="ctrlClass" role="alert" ng-bind="message" my-directive></div>',
			scope: {
				ctrlClass: "=",
				hardData: '='
			}
		};

		return myAlert;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myBtn', function($rootScope) {

		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'public/directives/my/myBtn/myBtn.html',
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



	appModule.directive('myCollectionBrowser', function($rootScope) {

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

	appModule.directive('myCollectionElem', function($rootScope, MySwitchable) {

		var myCollectionElem = {
			restrict: 'E',
			templateUrl: 'public/directives/my/myCollectionElem/myCollectionElem.html',
			transclude: {
				titleSection: '?titleSection',
				avatarSection: '?avatarSection',
				infoSection: '?infoSection'
			},
			scope: {
				data: '=',
				contextMenuConf: '=',
				isSelectable: '='
			},
			controller: function($scope) {

				if ($scope.contextMenuConf) {

					// Creating context menu
					$scope.contextMenu = new MySwitchable($scope.contextMenuConf);
					$scope.contextMenu.data = $scope.data;
				}
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

				};
			}
		};

		return myCollectionElem;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myContextMenu', function() {

		var myContextMenu = {
			restrict: 'E',
			templateUrl: 'public/directives/my/myContextMenu/myContextMenu.html',
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



	appModule.directive('myDateInput', function() {

		var myDateInput = {
			restrict: 'E',
			templateUrl: 'public/directives/my/myDateInput/myDateInput.html',
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



	appModule.directive('myDirective', function($rootScope, $timeout, hardDataService) {

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



	appModule.directive('myDropDown', function() {

		return {
			restrict: 'E',
			templateUrl: 'public/directives/my/myDropDown/myDropDown.html',
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



	appModule.directive('myElemSelector', function() {

		var myElemSelector = {
			restrict: 'E',
			templateUrl: 'public/directives/my/myElemSelector/myElemSelector.html',
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

	appModule.directive('myForm', function(MyLoader) {

		return {
			restrict: 'E',
			transclude: true,
			templateUrl: 'public/directives/my/myForm/myForm.html',
			scope: {
				ins: '=',
				hardData: '='
			},
			controller: function($scope) {

				$scope.ins.scope = $scope;

				$scope.loader = new MyLoader();
				$scope.ins.model.clear();
				$scope.ins.model.set();
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
			templateUrl: 'public/directives/my/myFormErrorIcon/myFormErrorIcon.html',
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

	appModule.directive('myGooglePlaceAutoComplete', function() {

		var myGooglePlaceAutoComplete = {
			restrict: 'E',
			templateUrl: 'public/directives/my/myGooglePlaceAutoComplete/myGooglePlaceAutoComplete.html',
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
								scope.autocomplete.label = place.formatted_address;
								scope.$apply();
							}
						});
					};

					scope.$watch('model.value', function(newValue, oldValue) {

						if (newValue) {

							var geocoder = new google.maps.Geocoder();

							geocoder.geocode({ 'address': newValue }, function(results, status) {
								if (status == 'OK') { scope.autocomplete.ins.set('place', results[0]); }
							});

						} else { scope.autocomplete.label = null; }
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
			templateUrl: 'public/directives/my/myInput/myInput.html',
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



	appModule.directive('myLabel', function() {

		var myLabel = {
			restrict: 'E',
			templateUrl: 'public/directives/my/myLabel/myLabel.html',
			scope: {
				text: '=',
				cssClass: '='
			}
		};

		return myLabel;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myLoader', function($timeout) {

		var myLoader = {
			restrict: 'E',
			templateUrl: 'public/directives/my/myLoader/myLoader.html',
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



	appModule.directive('myListGroup', function() {

		return {
			restrict: 'E',
			templateUrl: 'public/directives/my/myListGroup/myListGroup.html',
			scope: {
				ins: '='
			}
		};
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myModal', function($rootScope, $timeout) {

		return {
			restrict: 'E',
			templateUrl: 'public/directives/my/myModal/myModal.html',
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



	appModule.directive('myNavDropDown', function() {

		var myNavDropDown = {
			restrict: 'E',
			templateUrl: 'public/directives/my/myNavDropDown/myNavDropDown.html',
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
			templateUrl: 'public/directives/my/myNavMenu/myNavMenu.html',
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

	appModule.directive('myPanel', function(ui) {

		var myPanel = {
			restrict: 'E',
			templateUrl: 'public/directives/my/myPanel/myPanel.html',
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
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('mySelect', function(jsonService) {

		return {
			restrict: 'E',
			templateUrl: 'public/directives/my/mySelect/mySelect.html',
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
							select_scope.model.value = '';
							select_scope.collection = undefined;
						}
					};



					/* If I am not top select */

					if (myIndex > 0) {

						// Getting scope of the first select above
						var select_scope = $($($(elem).parent()[0].children[myIndex - 1]).find('select')[0]).scope();

						// Watching for its model changes
						scope.$watch(function() { return select_scope.model.value; }, function(newValue) {

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
							scope.$watch('model.value', function(newValue) {

								// Selecting option 1 as default, later setting model overrides this
								if (!scope.optionZero && !newValue && scope.collection) {
									scope.model.value = scope.collection[0][scope.propNames.optionValue];
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



	appModule.directive('myPopOverIcon', function() {

		var myPopOverIcon = {
			restrict: 'E',
			transclude: {
				icon: 'span'
			},
			templateUrl: 'public/directives/my/myPopOverIcon/myPopOverIcon.html',
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



	appModule.directive('mySelectsGroup', function(hardDataService) {

		var mySelectsGroup = {
			restrict: 'E',
			templateUrl: 'public/directives/my/mySelectsGroup/mySelectsGroup.html',
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

	appModule.directive('mySrc', function($timeout, MySwitchable) {

		var mySrc = {
			restrict: 'E',
			templateUrl: 'public/directives/my/mySrc/mySrc.html',
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

	appModule.directive('mySrcThumbs', function($rootScope, MySwitchable, MyModal) {

		var mySrcThumbs = {
			restrict: 'E',
			templateUrl: 'public/directives/my/mySrcThumbs/mySrcThumbs.html',
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

						// Watching thumbs collection srcs
						scope.$watchCollection('srcThumbsCollection.collection', function(collection) {

							if (collection) {

								var onClick = function() {

									if (scope.srcSlidesCollection.switchable) {

										// Changing active slides switchable
										scope.srcSlidesCollection.switchable.switchers[this.index].activate();

										// Displaying modal
										scope.srcSlidesModal.show();
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

								var onActivate = function() {
									scope.srcSlidesModal.title = scope.srcSlidesCollection.collection[this.index].filename;
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

	appModule.directive('mySrcSlides', function(MySwitchable) {

		var mySrcSlides = {
			restrict: 'E',
			templateUrl: 'public/directives/my/mySrcSlides/mySrcSlides.html',
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



	appModule.directive('myTabs', function() {

		return {
			restrict: 'E',
			templateUrl: 'public/directives/my/myTabs/myTabs.html',
			scope: {
				ins: '='
			}
		};
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('reportAvatar', function(reportAvatarService, reportAvatarConf, MySrc) {

		var reportAvatar = {
			restrict: 'E',
			templateUrl: 'public/directives/REPORT/reportAvatar/reportAvatar.html',
			scope: {
				report: '=',
				noLink: '&'
			},
			controller: function($scope) {

				$scope.src = new MySrc({ defaultUrl: reportAvatarConf.defaultUrl });
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					scope.$watch(function() { return scope.report; }, function(report) {

						if (report) {

							if (!scope.noLink()) { scope.src.href = '/#/report/photos?id=' + report._id; }
							scope.src.load(reportAvatarService.constructPhotoUrl(scope, true));
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

	var reportAvatarConf = function() {

		var conf = {
			defaultUrl: 'public/imgs/item.png'
		};

		return conf;
	};



	reportAvatarConf.$inject = [];
	angular.module('appModule').service('reportAvatarConf', reportAvatarConf);

})();
(function() {

	'use strict';

	var reportAvatarService = function(URLS) {

		var service = {
			constructPhotoUrl: function(scope, useThumb) {

				if (!scope.report.avatarFileName) { return scope.src.defaultUrl; }

				if (!useThumb) {
					return URLS.AWS3_UPLOADS_BUCKET_URL + scope.report.userId + '/reports/' + scope.report._id + '/' + scope.report.avatarFileName;

				} else {
					return URLS.AWS3_RESIZED_UPLOADS_BUCKET_URL + 'resized-' + scope.report.userId + '/reports/' + scope.report._id + '/' + scope.report.avatarFileName;
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



	appModule.directive('myTextArea', function() {

		var myTextArea = {
			restrict: 'E',
			templateUrl: 'public/directives/my/myTextArea/myTextArea.html',
			scope: {
				ctrlId: '=',
				ctrlMaxLength: '=',
				model: '=',
				hardData: '='
			}
		};

		return myTextArea;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('reportPhotos', function($rootScope, reportPhotosService, reportPhotosConf, MySrcCollection, MySrcAction, NUMS) {

		var reportPhotos = {
			restrict: 'E',
			templateUrl: 'public/directives/REPORT/reportPhotos/reportPhotos.html',
			scope: {
				report: '=',
				editable: '&'
			},
			controller: function($scope) {

				$scope.srcAction = new MySrcAction({
					acceptedFiles: 'image/png,image/jpg,image/jpeg',
					maxFiles: NUMS.reportMaxPhotos,
					maxFileSize: NUMS.photoMaxSize,
					getFilesCount: function() {
						return $rootScope.apiData.report.photos.length;
					}
				});

				// Initializing context menus
				$scope.mainContextMenuConf = reportPhotosConf.getMainContextMenuConf($scope);
				$scope.srcContextMenuConf = reportPhotosConf.getSrcContextMenuConf($scope);
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					// Watching current report
					scope.$watch(function() { return scope.report; }, function(report) {

						if (report) {

							// Instantiating

							scope.srcThumbsCollection = new MySrcCollection({
								defaultUrl: reportPhotosConf.defaultUrl,
								constructUrl: function(i) {
									return reportPhotosService.constructPhotoUrl(scope.report.userId, scope.report._id, scope.report.photos[i].filename, true);
								},
								uploadRequest: reportPhotosService.uploadRequest,
								remove: function(indexes) {

									for (var i = indexes.length - 1; i >= 0; i--) {
										scope.report.photos.splice(indexes[i], 1);
									}

									return scope.report.put();
								}
							});

							scope.srcSlidesCollection = new MySrcCollection({
								defaultUrl: reportPhotosConf.defaultUrl,
								constructUrl: function(i) {
									return reportPhotosService.constructPhotoUrl(scope.report.userId, scope.report._id, scope.report.photos[i].filename, false);
								}
							});

							// Initializing

							scope.srcThumbsCollection.init(scope.report.photos);

							scope.srcSlidesCollection.init(scope.report.photos, function() {
								for (var i in scope.srcSlidesCollection.collection) {
									scope.srcSlidesCollection.collection[i].href = scope.srcSlidesCollection.collection[i].url;
								}
							});
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
			defaultUrl: 'public/imgs/item.png',
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
							label: $rootScope.hardData.imperatives[16],
							onClick: function() {

								if (scope.srcAction.getFilesCount() < scope.srcAction.maxFiles) {
									$rootScope.$broadcast('displayMultipleFilesInput', {
										cb: function(files) {
											reportPhotosService.update('addToSet', scope, files);
										}
									});

								} else {
									scope.srcAction.displayModalMessage('MAX_FILES_UPLOADED');
								}
							}
						},
						{
							_id: 'delete',
							label: $rootScope.hardData.imperatives[14],
							onClick: function() {
								reportPhotosService.delete('multiple', scope);
							},
							isHidden: isHidden
						},
						{
							_id: 'refresh',
							label: $rootScope.hardData.imperatives[19],
							onClick: function() {
								scope.srcThumbsCollection.init(scope.report.photos);
							},
							isHidden: isHidden
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
						}
					]
				};
			},
			getSrcContextMenuConf: function(scope) {

				var move = function(that) {
					scope.srcThumbsCollection.moveSingle(that._id, that.parent.data, function() {
						reportPhotosService.afterUpdateSync(scope);
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

								$rootScope.$broadcast('displaySingleFileInput', {
									cb: function(files) {
										reportPhotosService.update('updateSingle', scope, files, that.parent.data);
									}
								});
							}
						},
						{
							_id: 'delete',
							label: $rootScope.hardData.imperatives[14],
							onClick: function() {
								reportPhotosService.delete('single', scope, this.parent.data);
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

								scope.report.avatarFileName = this.parent.data.filename;
								reportPhotosService.afterUpdateSync(scope);
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
			constructPhotoUrl: function(userId, reportId, filename, useThumb) {

				if (!useThumb) {
					return URLS.AWS3_UPLOADS_BUCKET_URL + userId + '/reports/' + reportId + '/' + filename;

				} else {
					return URLS.AWS3_RESIZED_UPLOADS_BUCKET_URL + 'resized-' + userId + '/reports/' + reportId + '/' + filename;
				}
			},
			uploadRequest: function(args, i) {

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
			update: function(actionId, scope, inputData, src) {

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
								src: src
							};

							scope.srcThumbsCollection[actionId](args, function(result) {
								self.afterUpdateSync(scope);
							});
						});

					// When action invalid
					} else { scope.srcAction.displayModalMessage(res.msgId); }
				});
			},
			delete: function(flag, scope, src, cb) {

				var collection;

				switch (flag) {

					case 'single':
						collection = [src];
						break;

					case 'multiple':
						collection = scope.srcThumbsCollection.getSelectedCollection();
						break;
				}

				scope.srcThumbsCollection.removeFromSet({ collection: collection }, function(success, results) {

					if (success) {
						ReportsRest.getList({ _id: $rootScope.apiData.report._id });
					}
				});
			},
			afterUpdateSync: function(scope, cb) {

				var copy = Restangular.copy($rootScope.apiData.report);

				copy.photos = [];

				for (var i in scope.srcThumbsCollection.collection) {
					copy.photos[i] = {
						filename: scope.srcThumbsCollection.collection[i].filename,
						size: scope.srcThumbsCollection.collection[i].size
					};
				}

				copy.put().then(function(res) {
					$rootScope.apiData.report = res.data;
					if (cb) { cb(true); }

				}, function(res) {
					if (cb) { cb(false); }
				});
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
			templateUrl: 'public/directives/USER/userAvatar/userAvatar.html',
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
							if (scope.withLabel) { scope.src.label = scope.user.truncatedUsername; }
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
					switchers: [
						{
							_id: 'update',
							label: $rootScope.hardData.imperatives[5],
							onClick: function() {

								$rootScope.$broadcast('displayImgCropWindow', {
									acceptCb: function(dataURI) {

										scope.src.update({ file: utilService.dataURItoBlob(dataURI) }, true).then(function(success) {
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

				scope.src.load(service.constructPhotoUrl(scope, true), force, function(success) {

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
(function() {

	'use strict';

	var reportsConf = function($rootScope, hardDataService, myClass, ReportsRest) {

		var hardData = hardDataService.get();

		this.searchCollectionBrowser = new myClass.MyCollectionBrowser({
			singlePageSize: 25,
			filterer: {
				switchers: [
					{
						_id: 'all',
						label: hardData.status[1]
					},
					{
						_id: 'lost',
						label: hardData.reportGroups[0].label2
					},
					{
						_id: 'found',
						label: hardData.reportGroups[1].label2
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

				var model = $rootScope.globalFormModels.reportSearchModel.getValues();

				query.subject = 'reports';
				query.title = model.title;
				query.categoryId = model.categoryId;
				query.subcategoryId = model.subcategoryId;

				return ReportsRest.getList(query);
			}
		});

		this.profileCollectionBrowser = new myClass.MyCollectionBrowser({
			singlePageSize: 25,
			filterer: {
				switchers: [
					{
						_id: 'all',
						label: hardData.status[1]
					},
					{
						_id: 'lost',
						label: hardData.reportGroups[0].label2
					},
					{
						_id: 'found',
						label: hardData.reportGroups[1].label2
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

				query.subject = 'user_reports';
				query.userId = $rootScope.apiData.profileUser._id;
				return ReportsRest.getList(query);
			}
		});

		this.recentlyReportedCollectionBrowser = new myClass.MyCollectionBrowser({
			singlePageSize: 5,
			noPager: true,
			fetchData: function(query) {

				query.subject = 'new_reports';
				query.sort='-dateAdded';
				query.limit = 5;

				return ReportsRest.getList(query);
			}
		});

		this.recentlyViewedCollectionBrowser = new myClass.MyCollectionBrowser({
			singlePageSize: 5,
			hideRefresher: true,
			fetchData: function(query) {

				query.subject = 'recently_viewed_reports';
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

	var ReportsRest = function($rootScope, $stateParams, Restangular, storageService, MyDataModel) {

		var reports = Restangular.service('reports');

		reports.myDataModel = {
			categoryId: {},
			subcategoryId: {},
			subsubcategoryId: {},
			title: {},
			serialNo: {},
			description: {},
			startEvent: {
				group: {},
				date: {},
				geolocation: {},
				details: {}
			}
		};

		Restangular.extendModel('reports', function(report) {

			report._isOwn = function() {
				return this.userId == $rootScope.globalFormModels.personalDetailsModel.getValue('_id');
			};

			return report;
		});

		return reports;
	};

	ReportsRest.$inject = ['$rootScope', '$stateParams', 'Restangular', 'storageService', 'MyDataModel'];
	angular.module('appModule').factory('ReportsRest', ReportsRest);

})();
(function() {

	'use strict';

	var reportsService = function($rootScope, $state, $stateParams, $timeout, $q, reportsConf, ReportsRest, Restangular) {

		var service = this;

		service.formModelFields = [
			'group',
			'categoryId',
			'subcategoryId',
			'subsubcategoryId',
			'title',
			'serialNo',
			'description',
			'date',
			'geolocation',
			'details'
		];

		service.getFormSubmitAction = function(scope) {

			switch (scope.action) {

				case 'newReport':

					return function(args) {

						scope.myForm.submitSuccessCb = function(res) {
							scope.myForm.reset();
							$state.go('app.report', { id: res.data._id });
						};

						var modelValues = scope.myModel.getValues();
						modelValues.userId = $rootScope.globalFormModels.personalDetailsModel.getValue('_id');

						var place = scope.autocomplete.ins.getPlace();

						if (place) {

							modelValues.geolocation = {
								lat: place.geometry.location.lat(),
								lng: place.geometry.location.lng()
							};

							modelValues.placeId = place.place_id;

						} else {
							modelValues.geolocation = null;
						}

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

						var copy = Restangular.copy($rootScope.apiData.report);
						scope.myModel.setRestObj(copy);
						return copy.put();
					};
			}
		};

		service.deleteReports = function(reports) {

			if (reports && reports.length > 0) {

				// Showing confirm modal
				$rootScope.ui.modals.deleteReportModal.show({
					message: (function() { return $rootScope.hardData.warnings[2]; })(),
					acceptCb: function() {

						var promises = [];
						for (var report of reports) { promises.push(report.remove({ userId: report.userId })); }

						$q.all(promises).then(function(results) {

							switch ($state.current.name) {

								case 'app.profile':
									$rootScope.$broadcast('initUserReports', { userId: $stateParams.id });
									break;

								case 'app.report':
									window.history.back();
									break;
							}
						});
					}
				});
			}
		};

		service.initUserReports = function(scope, userId) {

			scope.collectionBrowser = reportsConf.profileCollectionBrowser;

			if (userId == $rootScope.apiData.loggedInUser._id) {
				scope.elemContextMenuConf = scope.reportContextMenuConf;

			} else {
				$scope.elemContextMenuConf = undefined;
			}

			scope.collectionBrowser.onRefreshClick();
		};

		return service;
	};



	reportsService.$inject = ['$rootScope', '$state', '$stateParams', '$timeout', '$q', 'reportsConf', 'ReportsRest', 'Restangular'];
	angular.module('appModule').service('reportsService', reportsService);

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('userBadge', function($rootScope, $state, authService) {

		return {
			restrict: 'E',
			templateUrl: 'public/directives/USER/userBadge/userBadge.html',
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

	appModule.directive('singleFileInput', function() {

		var singleFileInput = {
			restrict: 'E',
			template: '<input id="singleFileInput" name="file" type="file" />',
			scope: true,
			controller: function($scope) {},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					var singleFileInput = $(elem).find('#singleFileInput').get()[0];
					var onChangeCb;

					scope.$on('displaySingleFileInput', function(e, args) {
						onChangeCb = args.cb;
						$(singleFileInput).val(undefined);
						$(singleFileInput).click();
					});

					$(singleFileInput).on('change', function(e) {
						if (e.target.files.length > 0) { onChangeCb(e.target.files); }
					});
				};
			}
		};

		return singleFileInput;
	});

	appModule.directive('multipleFilesInput', function() {

		var multipleFilesInput = {
			restrict: 'E',
			template: '<input id="multipleFilesInput" name="file" type="file" multiple />',
			scope: true,
			controller: function($scope) {},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					var multipleFilesInput = $(elem).find('#multipleFilesInput').get()[0];
					var onChangeCb;

					scope.$on('displayMultipleFilesInput', function(e, args) {
						onChangeCb = args.cb;
						$(multipleFilesInput).val(undefined);
						$(multipleFilesInput).click();
					});

					$(multipleFilesInput).on('change', function(e) {
						if (e.target.files.length > 0) { onChangeCb(e.target.files); }
					});
				};
			}
		};

		return multipleFilesInput;
	});

})();