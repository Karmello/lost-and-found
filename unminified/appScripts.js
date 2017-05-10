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
		localStorageServiceProvider.setPrefix('auction_house');



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
		itemMaxPhotos: 15,
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

					case 'main.profile':
					case 'main.item':

						if (toState.id == toParams.id) {
							newScrollY = $state.current.scrollY;

						} else {
							newScrollY = 0;
						}

						toState.id = toParams.id;
						break;

					case 'main.search':
						newScrollY = $state.current.scrollY;
						break;

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

	var mainFrameConf = function($rootScope, $q, hardDataService) {

		var hardData = hardDataService.get();

		var config = {
			_ctrlId: 'mainFrame',
			switchers: [
				{
					_id: 'home',
					route: '/#/home',
					label: hardData.phrases[35],
					icon: 'glyphicon glyphicon-home'
				},
				{
					_id: 'search',
					route: '/#/search',
					label: hardData.phrases[83],
					icon: 'glyphicon glyphicon-search'
				},
				{
					_id: 'profile',
					label: hardData.phrases[38],
					icon: 'glyphicon glyphicon-user'
				},
				{
					_id: 'about',
					route: '/#/about',
					label: hardData.phrases[40],
					icon: 'glyphicon glyphicon-info-sign'
				},
				{
					_id: 'help',
					route: '/#/help',
					label: hardData.phrases[41],
					icon: 'glyphicon glyphicon-question-sign'
				},
				{
					_id: 'contact',
					route: '/#/contact',
					label: hardData.phrases[42],
					icon: 'glyphicon glyphicon-envelope'
				},
				{
					_id: 'item',
					label: hardData.phrases[62],
					icon: 'glyphicon glyphicon-shopping-cart'
				},
				{
					_id: 'settings',
					label: hardData.phrases[39],
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



	mainFrameConf.$inject = ['$rootScope', '$q', 'hardDataService'];
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
					route: '/#/guest/login',
					label: hardData.phrases[12],
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
			tryAgainLaterModal: new MyModal({
				typeId: 'infoModal',
				title: hardData.phrases[57],
				message: hardData.sentences[20]
			}),
			tryToRefreshModal: new MyModal({
				typeId: 'infoModal',
				title: hardData.phrases[57],
				message: hardData.sentences[34]
			}),
			passResetDoneModal: new MyModal({
				typeId: 'infoModal',
				title: hardData.phrases[96],
				message: hardData.sentences[58]
			}),
			deactivationDoneModal: new MyModal({
				typeId: 'infoModal',
				title: hardData.phrases[59],
				message: hardData.sentences[28]
			}),
			confirmProceedModal: new MyModal({
				typeId: 'confirmModal',
				message: hardData.sentences[18]
			}),
			confirmDeactivationModal1: new MyModal({
				typeId: 'confirmDangerModal',
				title: hardData.phrases[56],
				message: hardData.sentences[14]
			}),
			confirmDeactivationModal2: new MyModal({
				typeId: 'confirmDangerModal',
				title: hardData.phrases[56],
				message: hardData.sentences[15]
			}),
			deleteItemModal: new MyModal({
				typeId: 'confirmDangerModal',
				title: hardData.phrases[65]
			}),
			auctionSubscribersModal: new MyModal({
				id: 'auctionSubscribersModal',
				title: hardData.phrases[71]
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
					label: hardData.phrases[43],
					onActivate: function() {
						$rootScope.globalFormModels.appConfigModel.set();
					}
				},
				{
					_id: 'account',
					label: hardData.phrases[44],
					onActivate: function() {
						$rootScope.globalFormModels.personalDetailsModel.set();
						$rootScope.globalFormModels.passwordModel.clear();
					}
				},
				// {
				// 	_id: 'payment',
				// 	label: hardData.phrases[45],
				// },
				{
					_id: 'danger',
					label: hardData.phrases[46],
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

	var guestTabsConf = function($rootScope) {

		var config = {
			_ctrlId: 'guestTabs',
			switchers: [
				{
					_id: 'login',
					route: '/#/guest/login',
					onActivate: function() { $rootScope.globalFormModels.userModel.clearErrors(); }
				},
				{
					_id: 'register',
					route: '/#/guest/register',
					onActivate: function() { $rootScope.globalFormModels.userModel.clearErrors(); }
				},
				{
					_id: 'recover',
					route: '/#/guest/recover',
					onActivate: function() { $rootScope.globalFormModels.userModel.clearErrors(); }
				},
				{
					_id: 'status',
					route: '/#/guest/status',
					onActivate: function() { $rootScope.globalFormModels.userModel.clearErrors(); }
				}
			],
			hardData: { switchers_label: ['phrases', [47, 48, 21, 49]], switchers_info: ['sentences', [4, 5, 6, 7]] }
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
						label: hardData.phrases[73],
						info: hardData.sentences[54],
						onActivate: function() {
							$rootScope.globalFormModels.appConfigModel.set();
						}
					},
					{
						_id: 'regional',
						route: '/#/settings/application/regional',
						label: hardData.phrases[50],
						info: hardData.sentences[8],
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
						label: hardData.phrases[51],
						info: hardData.sentences[9],
						onActivate: function() {
							$rootScope.globalFormModels.personalDetailsModel.set();
						}
					},
					{
						_id: 'password',
						route: '/#/settings/account/password',
						label: hardData.phrases[52],
						info: hardData.sentences[10],
						onActivate: function() {
							$rootScope.globalFormModels.passwordModel.clear();
						}
					}
				]
			},
			payment: {
				_ctrlId: 'paymentTabs',
				switchers: [
					{
						_id: 'paypal',
						route: '/#/settings/payment/paypal',
						label: hardData.phrases[54],
						info: hardData.sentences[12]
					}
				]
			},
			danger: {
				_ctrlId: 'dangerTabs',
				switchers: [
					{
						_id: 'deactivate',
						route: '/#/settings/danger/deactivate',
						label: hardData.phrases[55],
						info: hardData.sentences[13],
						onActivate: function() {
							$rootScope.globalFormModels.deactivationModel.clear();
						}
					}
				]
			}
		};

		return tabs;
	};

	var itemTabsConf = function($rootScope) {

		var getRoute = function() {

			if ($rootScope.apiData.item) {
				return '/#/item/' + this._id + '?id=' + $rootScope.apiData.item._id;
			}
		};

		var config = {
			_ctrlId: 'itemTabs',
			switchers: [
				{
					_id: 'photos',
					getRoute: getRoute,
					onActivate: function() {}
				},
				{
					_id: 'auctions',
					getRoute: getRoute,
					onActivate: function() {}
				},
				{
					_id: 'comments',
					getRoute: getRoute,
					onActivate: function() {}
				}
			],
			hardData: { switchers_label: ['phrases', [70, 134, 58]] }
		};

		return config;
	};



	guestTabsConf.$inject = ['$rootScope'];
	settingsTabsConf.$inject = ['$rootScope', 'hardDataService'];
	itemTabsConf.$inject = ['$rootScope'];

	angular.module('appModule').service('guestTabsConf', guestTabsConf);
	angular.module('appModule').service('settingsTabsConf', settingsTabsConf);
	angular.module('appModule').service('itemTabsConf', itemTabsConf);

})();
(function() {

	'use strict';

	var topNavMenuConf = function() {

		var config = {
			_ctrlId: 'topNavMenu',
			switchers: [
				{ _id: 'home' },
				{ _id: 'search' }
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
		uiSetupService, myClass, Restangular
	) {

		$rootScope.socket = io('http://localhost:8080');

		$rootScope.ui = ui;
		$rootScope.hardData = hardDataService.get();
		$rootScope.Math = window.Math;

		$rootScope.apiData = {
			loggedInUser: undefined,
			profileUser: undefined,
			itemUser: undefined,
			item: undefined,
			auction: undefined,
			itemCategories: undefined,
			deactivationReasons: undefined,
			contactTypes: undefined
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
			itemSearchModel: new myClass.MyFormModel(
				'itemSearchModel',
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
				$state.go('guest.1', params);
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
		'hardDataService', 'ui', 'uiSetupService', 'myClass', 'Restangular'
	];

	angular.module('appModule').controller('AppController', AppController);

})();
(function() {

	'use strict';

	var AuctionController = function($rootScope, $scope, ui) {

		// On subscribe click
		$scope.onSubscribeToAnAuctionClick = function() {

			$rootScope.apiData.auction._subscribe();
		};

		// On unsubscribe click
		$scope.onUnsubscribeFromAnAuctionClick = function() {

			$rootScope.apiData.auction._unsubscribe();
		};

		// On show subscribers click
		$scope.onSeeAuctionSubscribersClick = function() {

			$rootScope.$broadcast('auctionSubscribersWindowOpen');
			ui.modals.auctionSubscribersModal.show();
		};
	};

	AuctionController.$inject = ['$rootScope', '$scope', 'ui'];
	angular.module('appModule').controller('AuctionController', AuctionController);

})();
(function() {

	'use strict';

	var BrowseController = function($scope) {};

	BrowseController.$inject = ['$scope'];
	angular.module('appModule').controller('BrowseController', BrowseController);

})();
(function() {

	'use strict';

	var ContactController = function($scope, sessionConst) {


	};

	ContactController.$inject = ['$scope', 'sessionConst'];
	angular.module('appModule').controller('ContactController', ContactController);

})();
(function() {

	'use strict';

	var GuestController = function($scope, authService) {

		$scope.$watch(function() { return authService.state.loggedIn; }, function(loggedIn) {

			for (var i = 0; i < 3; i++) { $scope.ui.tabs.guest.switchers[i].isVisible = !loggedIn; }
			$scope.ui.tabs.guest.switchers[3].isVisible = loggedIn;
		});
	};

	GuestController.$inject = ['$scope', 'authService'];
	angular.module('appModule').controller('GuestController', GuestController);

})();
(function() {

	'use strict';

	var HomeController = function($scope) {


	};

	HomeController.$inject = ['$scope'];
	angular.module('appModule').controller('HomeController', HomeController);

})();
(function() {

	'use strict';

	var ItemController = function(
		$rootScope, $scope, itemsService, auctionsService, itemsConf, auctionsConf, commentsConf, MySwitchable
	) {

		$scope.itemsService = itemsService;
		$scope.auctionsBrowser = auctionsConf.itemAuctionsBrowser;
		$scope.commentsBrowser = commentsConf.itemCommentsBrowser;

		$scope.auctionsContextMenu = new MySwitchable({
			_id: 'auctionsContextMenu',
			icon: 'glyphicon glyphicon-option-horizontal',
			switchers: [
				{
					_id: 'add',
					label: $rootScope.hardData.phrases[16],
					onClick: function() {
						$rootScope.$broadcast('displayAddAuctionWindow');
					}
				},
				{
					_id: 'delete',
					label: $rootScope.hardData.phrases[14],
					onClick: function() {
						auctionsService.deleteAuctions($scope.auctionsBrowser.getSelectedCollection());
					}
				}
			]
		});

		$scope.$watch(function() { return $rootScope.apiData.item; }, function(item) {

			if (item && item._isOwn()) {
				$scope.itemContextMenu = new MySwitchable(itemsConf.itemContextMenuConf);
				$scope.itemContextMenu.data = item;

			} else {
				$scope.itemContextMenu = null;
			}
		});

		$scope.scrollTo = function(target) {

			$('html, body').animate({ scrollTop: $(target).offset().top - 15 }, 'fast');
		};
	};

	ItemController.$inject = [
		'$rootScope', '$scope', 'itemsService', 'auctionsService', 'itemsConf', 'auctionsConf', 'commentsConf',
		'MySwitchable'
	];

	angular.module('appModule').controller('ItemController', ItemController);

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

	var ProfileController = function($rootScope, $scope) {


	};

	ProfileController.$inject = ['$rootScope', '$scope'];
	angular.module('appModule').controller('ProfileController', ProfileController);

})();
(function() {

	'use strict';

	var SearchController = function($scope) {

	};

	SearchController.$inject = ['$scope'];
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

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('guest.1', {
			url: '/guest/:tab?action',
			resolve: {
				tab: function(countries, $q, $state, $stateParams, ui) {

					return $q(function(resolve, reject) {

						var availableParams = ui.tabs.guest.switcherIds;

						// Valid tab
						if (availableParams.indexOf($stateParams.tab) > -1) {
							resolve();

						// Invalid tab
						} else {

							$state.go('guest.1', { tab: 'login' }, { location: 'replace' });
						}
	    			});
				},
				authentication: function(tab, $q, $state, $stateParams, authService) {

					return $q(function(resolve) {

						authService.authenticate(function(success) {

							if (success && $stateParams.tab != 'status') {
								$state.go('guest.1', { tab: 'status' }, { location: 'replace' });

							} else {
								resolve();
							}
						});
					});
				}
			},
			onEnter: function($state, $stateParams, $timeout, ui) {

				ui.tabs.guest.activateSwitcher($stateParams.tab);
				ui.frames.main.activateSwitcher();

				$timeout(function() {

					if ($state.params.action == 'deactivation') {

						$timeout(function() {
							ui.modals.deactivationDoneModal.show();
						}, 500);
					}

				}, 2500);
			}
		});
	});

})();
(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('guest', {
			abstract: true,
			views: {
				view1: { templateUrl: 'public/pages/lost-and-found-app-guest.html' }
			},
			resolve: {
				captchaApi: function($q, ui, utilService) {

					return $q(function(resolve, reject) {

						try {
							if (grecaptcha) { resolve(); }

						} catch (ex) {
							window.captchaApiLoaded = function() { resolve(); };
							utilService.loadScript('https://www.google.com/recaptcha/api.js?onload=captchaApiLoaded&render=explicit');
						}
					});
				},
				countries: function(captchaApi, $q, $rootScope, ui, fileService) {

					return $q(function(resolve, reject) {

						if (fileService.countries.data) {
							resolve();

						} else {

							fileService.countries.readFile(function(success) {

								if (success) {
									fileService.countries.alterData(function() {
										resolve();
									});

								} else {

									ui.loaders.renderer.stop(function() {
										$rootScope.ui.modals.tryToRefreshModal.show();
									});
								}
							});
						}
					});
				}
			},
			onEnter: function($rootScope, $state, $timeout, ui) {

				$timeout(function() {

					if ($state.params.tab == 'login' && $state.params.action == 'pass_reset') {

						$timeout(function() {
							$rootScope.ui.modals.passResetDoneModal.show();
						}, 500);
					}

				}, 2500);
			}
		});
	});

})();
(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.about', {
			url: '/about',
			onEnter: function(ui) {

				ui.frames.main.activateSwitcher('about');
				ui.menus.top.activateSwitcher('about');
			}
		});
	});

})();
(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.contact', {
			url: '/contact',
			onEnter: function(ui) {

				ui.frames.main.activateSwitcher('contact');
				ui.menus.top.activateSwitcher('contact');
			}
		});
	});

})();
(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.help', {
			url: '/help',
			onEnter: function(ui) {

				ui.frames.main.activateSwitcher('help');
				ui.menus.top.activateSwitcher('help');
			}
		});
	});

})();
(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.home', {
			url: '/home',
			onEnter: function(ui) {

				ui.menus.top.activateSwitcher('home');
				ui.frames.main.activateSwitcher('home');
			}
		});
	});

})();
(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.item', {
			url: '/item/:tab?id',
			resolve: {
				_apiData: function(itemCategories, $stateParams, $rootScope, $q) {

					return $q(function(resolve) {

						if ($rootScope.apiData.item && $rootScope.apiData.item._id != $stateParams.id) {
							$rootScope.apiData.item = undefined;
							$rootScope.apiData.itemUser = undefined;
						}

						resolve();
					});
				},
				_ui: function(_apiData, $stateParams, $q, ui) {

					return $q(function(resolve) {
						ui.menus.top.activateSwitcher();
						ui.frames.main.activateSwitcher('item');
						ui.tabs.item.activateSwitcher($stateParams.tab);
						resolve();
					});
				},
				_item: function(_ui, $stateParams, $q, ItemsRest) {

					return $q(function(resolve) {

						ItemsRest.getList({ _id: $stateParams.id }).then(function() {
							resolve(true);

						}, function() {
							resolve(false);
						});
					});
				},
				_user: function(_item, $stateParams, $q, UsersRest) {

					return $q(function(resolve) {

						UsersRest.getList({ itemId: $stateParams.id }).then(function() {
							resolve(true);

						}, function() {
							resolve(false);
						});
					});
				}
			},
			onEnter: function(_item, _user, $rootScope) {

				if (!_item || !_user) { $rootScope.ui.modals.tryAgainLaterModal.show(); }
			}
		});
	});

})();
(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main', {
			abstract: true,
			views: {
				view1: { templateUrl: 'public/pages/lost-and-found-app-main.html' }
			},
			resolve: {
				authentication: function($timeout, $state, $q, authService, ui) {

					return $q(function(resolve, reject) {

						authService.authenticate(function(success, res) {

							if (success) {
								resolve();

							} else {
								$timeout(function() { $state.go('guest.1', { tab: 'login' }, { location: 'replace' }); });
							}
						});
					});
				},
				openExchangeRates: function(authentication, $rootScope, $q, ui, exchangeRateService) {

					return $q(function(resolve, reject) {

						var promises = [];

						angular.forEach(exchangeRateService.config.availableRates, function(rate, rateKey) {

							var promise = $q(function(resolve, reject) {

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

							if (results.indexOf(false) == -1) {
								resolve();

							} else {

								ui.loaders.renderer.stop(function() {
									$rootScope.ui.modals.tryToRefreshModal.show();
								});
							}
						});
					});
				},
				countries: function(openExchangeRates, $rootScope, $q, ui, fileService) {

					return $q(function(resolve, reject) {

						if (fileService.countries.data) {
							resolve();

						} else {

							fileService.countries.readFile(function(success) {

								if (success) {
									fileService.countries.alterData(function() {
										resolve();
									});

								} else {

									ui.loaders.renderer.stop(function() {
										$rootScope.ui.modals.tryToRefreshModal.show();
									});
								}
							});
						}
					});
				},
				deactivationReasons: function(countries, $rootScope, $q, $filter, DeactivationReasonsRest) {
					return $q(function(resolve) {

						DeactivationReasonsRest.getList().then(function(res) {
							$rootScope.apiData.deactivationReasons = $filter('orderBy')(res.data.plain(), 'index');
							resolve(true);

						}, function() {
							$rootScope.apiData.deactivationReasons = undefined;
							resolve(false);
						});
					});
				},
				contactTypes: function(deactivationReasons, $rootScope, $q, $filter, ui, ContactTypesRest) {
					return $q(function(resolve) {

						ContactTypesRest.getList().then(function(res) {
							$rootScope.apiData.contactTypes = $filter('orderBy')(res.data.plain(), 'index');
							resolve(true);

						}, function() {
							$rootScope.apiData.contactTypes = undefined;
							resolve(false);
						});
					});
				},
				itemCategories: function(contactTypes, $q, $rootScope, ItemCategoriesRest, ui) {

					return $q(function(resolve, reject) {

						ItemCategoriesRest.getList().then(function(res) {

							$rootScope.apiData.itemCategories = res.data.plain();
							resolve();

						}, function() {

							ui.loaders.renderer.stop(function() {
								$rootScope.ui.modals.tryToRefreshModal.show();
							});
						});
					});
				}
			},
			onEnter: function($timeout, ui) {

				// Resetting settingsListGroup
				ui.listGroups.settings.getFirstSwitcher().activate();

				// Resetting settingsListGroup tabs
				angular.forEach(ui.listGroups.settings.switchers, function(switcher) {
					ui.tabs[switcher._id].getFirstSwitcher().activate();
				});
			}
		});
	});

})();
(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.profile', {
			url: '/profile?id',
			resolve: {
				_ui: function(itemCategories, $q, ui)	 {

					return $q(function(resolve) {

						ui.menus.top.activateSwitcher();
						ui.frames.main.activateSwitcher('profile');
						resolve();
					});
				},
				_user: function(_ui, $stateParams, $q, UsersRest) {

					return $q(function(resolve) {

						UsersRest.getList({ _id: $stateParams.id }).then(function() {
							resolve(true);

						}, function() {
							resolve(false);
						});
					});
				}
			},
			onEnter: function(_user, $rootScope) {

				if (!_user) { $rootScope.ui.modals.tryAgainLaterModal.show(); }
			}
		});
	});

})();
(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.search', {
			url: '/search',
			resolve: {
				_ui: function(itemCategories, $q, ui) {

					return $q(function(resolve) {

						ui.menus.top.activateSwitcher('search');
						ui.frames.main.activateSwitcher('search');

						resolve();
					});
				}
			},
			onEnter: function($rootScope) {


			}
		});
	});

})();
(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.settings1', {
			url: '/settings',
			resolve: {
				redirection: function($q, $timeout, $state, ui) {

					return $q(function() {

						// Setting catId and subcatId and going to main.setting3 state

						var catId = ui.listGroups.settings.activeSwitcherId;

						$timeout(function() {
							$state.go('main.settings3', {
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

		$stateProvider.state('main.settings2', {
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
									$state.go('main.settings1', {}, { location: 'replace' });
								});
							}
						});
					});
				},
				redirection: function(catId, $timeout, $state, $stateParams, ui) {

					// Setting subcatId and going to main.setting3 state

					$timeout(function() {
						$state.go('main.settings3', {
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

		$stateProvider.state('main.settings3', {
			url: '/settings/:catId/:subcatId',
			resolve: {
				params: function($timeout, $q, $state, $stateParams, ui) {

					return $q(function(resolve, reject) {

						var settingsSwitcher = ui.frames.main.getSwitcher('_id', 'settings');

						$q.all([
							settingsSwitcher.validateCatId($stateParams, ui),
							settingsSwitcher.validateSubcatId($stateParams, ui)

						]).then(function(results) {

							if (!results[0]) {

								$timeout(function() {
									$state.go('main.settings1', {}, { location: 'replace' });
								});

							} else if (!results[1]) {

								$timeout(function() {
									$state.go('main.settings2', { catId: $stateParams.catId }, { location: 'replace' });
								});

							} else { resolve(); }
						});
					});
				}
			},
			onEnter: function($stateParams, ui) {

				ui.menus.top.activateSwitcher('settings');

				ui.listGroups.settings.activateSwitcher($stateParams.catId);
				ui.dropdowns.settingsCategories.activateSwitcher($stateParams.catId);
				ui.tabs[$stateParams.catId].activateSwitcher($stateParams.subcatId);

				ui.frames.main.activateSwitcher('settings');
			}
		});
	});

})();
(function() {

	'use strict';

	var apiService = function(
		$rootScope, $window, $timeout, $moment, storageService, itemsConf, auctionsConf, commentsConf, Restangular
	) {

		var service = {
			setup: function() {

				Restangular.setBaseUrl('/api');
				Restangular.setFullResponse(true);
				Restangular.setRestangularFields({ id: '_id' });
				Restangular.addResponseInterceptor(service.interceptResponse);

				Restangular.addElementTransformer('users', false, function(user) {

					if (user.username) {
						user.truncatedUsername = user.username.truncate(15);
						user.formattedRegistrationDate = $moment(user.registration_date).format('DD-MM-YYYY HH:mm');
						user.countryFirstLetter = user.country[0];

					} else if (user.user) {
						user.user.truncatedUsername = user.user.username.truncate(15);
						user.user.formattedRegistrationDate = $moment(user.user.registration_date).format('DD-MM-YYYY HH:mm');
						user.user.countryFirstLetter = user.user.country[0];
					}

					return user;
				});

				Restangular.addElementTransformer('items', false, function(item) {
					item.truncatedTitle = item.title.truncate(25);
					item.formattedDateAdded = $moment(item.dateAdded).format('DD-MM-YYYY HH:mm');
					item.pastSinceAdded = $moment.duration($moment(new Date()).diff($moment(item.dateAdded))).humanize();
					service.createItemFullCategoryString(item);
					return item;
				});

				Restangular.addElementTransformer('auctions', false, function(auction) {
					auction.pastSinceAdded = $moment.duration($moment(new Date()).diff($moment(auction.dateAdded))).humanize();
					auction.formattedDateAdded = $moment(auction.dateAdded).format('DD-MM-YYYY HH:mm');
					return auction;
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

									} else if (res.config.params.itemId) {
										$rootScope.apiData.itemUser = data[0];
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

					case 'items':

						switch (operation) {

							case 'getList':

								if (res.config.params) {

									if (res.config.params._id) {

										if (!$rootScope.apiData.item) {
											$rootScope.apiData.item = data[0];
										}

										return data;

									} else if (res.config.params.userId) {

										itemsConf.profileCollectionBrowser.setData(data);
										return data.collection;

									} else {
										itemsConf.searchCollectionBrowser.setData(data);
										return data.collection;
									}
								}

								break;

							case 'put':

								return data;
						}

						break;

					case 'auctions':

						switch (operation) {

							case 'getList':

								if (res.config.params.userId) {
									for (i in data.collection) { data.collection[i].item = data.items[i]; }
									auctionsConf.userAuctionsBrowser.setData(data);

								} else if (res.config.params.itemId) {
									auctionsConf.itemAuctionsBrowser.setData(data);

								} else {
									$rootScope.apiData.auction = data[0];
								}

								return data.collection;
						}

						break;

					case 'comments':

						switch (operation) {

							case 'getList':

								for (i in data.collection) { data.collection[i].user = data.users[i]; }
								commentsConf.itemCommentsBrowser.setData(data);
								break;
						}

						return data.collection;
				}

				return data;
			},
			createItemFullCategoryString: function(item) {

				var category = _.find($rootScope.apiData.itemCategories, function(obj) {
					return obj._id == item.categoryId;
				});

				var subcategory = _.find(category.subcategories, function(obj) {
					return obj._id == item.subcategoryId;
				});

				item.fullCategory = category.label + ' / ' + subcategory.label;
			}
		};

		return service;
	};

	apiService.$inject = [
		'$rootScope', '$window', '$timeout', '$moment', 'storageService', 'itemsConf', 'auctionsConf', 'commentsConf',
		'Restangular'
	];

	angular.module('appModule').service('apiService', apiService);

})();
(function() {

	'use strict';

	var authService = function($rootScope, $window, storageService, sessionConst, UsersRest) {

		var service = {
			state: {
				authenticated: false,
				loggedIn: false
			},
			authenticate: function(cb) {

				// Token not authenticated yet
				if (!service.state.authenticated) {

					var authToken = storageService.authToken.getValue();

					// Auth token found
					if (authToken) {

						UsersRest.post({ authToken: authToken }).then(function(res) {

							// Successful authentication
							service.setAsLoggedIn(function() {
								cb(true, res);
							});

						}, function(res) {

							// Could not authenticate
							service.setAsLoggedOut(function() {
								cb(false, res);
							});
						});

					// No auth token
					} else {

						service.setAsLoggedOut(function() {
							cb(false);
						});
					}

				// Already authenticated
				} else {

					service.state.loggedIn = true;
					cb(true);
				}
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

	authService.$inject = ['$rootScope', '$window', 'storageService', 'sessionConst', 'UsersRest'];
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

	var fileService = function(myClass, jsonService) {

		var countries = new myClass.MyFile('public/json/countries.json', function(cb) {

			jsonService.sort.objectsByProperty(countries.data, 'name', true, function(sorted) {
				jsonService.group.sortedObjectsByPropFirstLetter(sorted, 'name', function(grouped) {

					countries.data = grouped;
					cb();
				});
			});
		});

		return {
			countries: countries
		};
	};



	fileService.$inject = ['myClass', 'jsonService'];
	angular.module('appModule').service('fileService', fileService);

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
		mainFrameConf, topNavMenuConf, settingsListGroupConf, guestTabsConf, settingsTabsConf, itemTabsConf,
		mainFrameNavConf, modalsConf, myClass, uiSetupService
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
				main: new myClass.MySwitchable(mainFrameConf)
			},
			menus: {
				top: new myClass.MySwitchable(topNavMenuConf)
			},
			listGroups: {
				settings: new myClass.MySwitchable(settingsListGroupConf)
			},
			tabs: {
				guest: new myClass.MySwitchable(guestTabsConf),
				application: new myClass.MySwitchable(settingsTabsConf.application),
				account: new myClass.MySwitchable(settingsTabsConf.account),
				payment: new myClass.MySwitchable(settingsTabsConf.payment),
				danger: new myClass.MySwitchable(settingsTabsConf.danger),
				item: new myClass.MySwitchable(itemTabsConf)
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
		'mainFrameConf', 'topNavMenuConf', 'settingsListGroupConf', 'guestTabsConf', 'settingsTabsConf', 'itemTabsConf',
		'mainFrameNavConf', 'modalsConf', 'myClass', 'uiSetupService'
	];

	angular.module('appModule').service('ui', ui);

})();
(function() {

	'use strict';

	var uiSetupService = function() {

		var itemsPageCreated = false;

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

		var loadScript = function(url) {

			var script = document.createElement('script');
			script.type = 'application/javascript';
			script.async = true;
			script.src = url;
			document.body.appendChild(script);
		};

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
			loadScript: loadScript,
			dataURItoBlob: dataURItoBlob
		};
	};



	utilService.$inject = [];
	angular.module('appModule').service('utilService', utilService);

})();
(function() {

	'use strict';

	var myClass = function(
		MySwitchable, MySwitcher, MyLoader, MyModal, MyFile, MySrc, MyStorageItem, MyFormModel, MyCollectionBrowser,
		MySrcCollection, MyForm, MySrcAction
	) {

		return {
			MySwitchable: MySwitchable,
			MySwitcher: MySwitcher,
			MyLoader: MyLoader,
			MyModal: MyModal,
			MyFile: MyFile,
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
		'MySwitchable', 'MySwitcher', 'MyLoader', 'MyModal', 'MyFile', 'MySrc', 'MyStorageItem', 'MyFormModel',
		'MyCollectionBrowser', 'MySrcCollection', 'MyForm', 'MySrcAction'
	];

	angular.module('appModule').factory('myClass', myClass);

})();
(function() {

	'use strict';

	var MyCollectionBrowser = function(hardDataService, MyCollectionSelector, MySwitchable, MyLoader) {

		var hardData = hardDataService.get();

		var MyCollectionBrowser = function(config) {

			Object.assign(MyCollectionBrowser.prototype, MyCollectionSelector.prototype);

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
				this.sorter.togglerLabel = hardData.phrases[90];

				for (var i in this.sorter.switchers) { this.sorter.switchers[i].onClick = this.onClick; }

				this.orderer = new MySwitchable({
					switchers: [
						{ _id: 'asc', label: hardData.phrases[87] },
						{ _id: 'desc', label: hardData.phrases[88] }
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
							that.pager.togglerLabel = hardData.phrases[89];

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
						that.updateRefresher();
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
					that.pager.activateSwitcher(currentPage);
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

		MyCollectionBrowser.prototype.updateRefresher = function() {

			this.refresher = {};

			if (this.collection) {

				if (this.meta.count > 0) {
					this.refresher.refresherLabel = hardData.phrases[92] + ' ' + this.meta.count;

				} else {
					this.refresher.refresherLabel = hardData.phrases[64];
				}
			}

			if (this.meta.count > 0) {
				this.refresher.class = 'btn-info';

			} else {
				this.refresher.class = 'btn-warning';
			}
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

			for (var i in this.collection) { this.collection[i].isSelected = true; }
		};

		MyCollectionSelector.prototype.deselectAll = function() {

			for (var i in this.collection) { this.collection[i].isSelected = false; }
		};

		MyCollectionSelector.prototype.getSelectedCollection = function() {

			var selected = [];

			for (var obj of this.collection) {
				if (obj.isSelected) { selected.push(obj); }
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

	var MyFile = function($http) {

		var MyFile = function(url, alterData) {

			this.url = url;
			this.alterData = alterData;

			this.data = undefined;
		};

		MyFile.prototype.readFile = function(cb) {

			var that = this;

			$http.get(that.url).success(function(res) {

				that.data = res;
				if (cb) { cb(true); }

			}).error(function() {

				that.data = undefined;
				if (cb) { cb(false); }
			});
		};

		return MyFile;
	};



	MyFile.$inject = ['$http'];
	angular.module('appModule').factory('MyFile', MyFile);

})();
(function() {

	'use strict';

	var MyForm = function($rootScope, $window, $timeout, grecaptchaService) {

		MyForm = function(config) {

			this.ctrlId = config.ctrlId;
			this.model = config.model;
			this.reload = config.reload;
			this.noLoader = config.noLoader;

			this.submitAction = config.submitAction;
			this.submitSuccessCb = config.submitSuccessCb;
			this.submitErrorCb = config.submitErrorCb;
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

								that.model.clearErrors(function() {
									$timeout(function() {
										that.scope.loader.stop();
									});
								});

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
			this.scope.$broadcast('reset');
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

		var MyFormModel = function(_id, keys, allowUseDefaults, onSetCallback) {

			this._id = _id;
			this.keys = keys;
			this.values = {};

			this.defaults = undefined;
			this.allowUseDefaults = allowUseDefaults;
			this.onSetCallback = onSetCallback;

			this.clear();
		};

		MyFormModel.prototype = {
			set: function(freshValues) {

				var that = this;

				// Setting with fresh values
				if (typeof freshValues == 'object') {

					if (that.allowUseDefaults && Object.keys(freshValues).length > 0) { that.defaults = freshValues; }

					if (_.isEmpty(freshValues)) {

						angular.forEach(that.keys, function(key) {
							that.values[key].value = null;
						});

					} else {

						angular.forEach(that.keys, function(key) {
							that.values[key].value = freshValues[key];
						});
					}

				// Setting with defaults
				} else {

					if (this.allowUseDefaults && that.defaults) {

						angular.forEach(that.keys, function(key) {
							that.values[key].value = that.defaults[key];
						});
					}
				}
			},
			setValue: function(key, value) {

				this.values[key].value = value;
			},
			clear: function() {

				var that = this;

				angular.forEach(that.keys, function(key) {
					that.values[key] = new MyFormModelValue(null, null, null);
				});
			},
			trimValues: function(formId, callback) {

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

				if (callback) { callback(); }
			},
			getValues: function() {

				var that = this;
				var values = {};

				angular.forEach(that.keys, function(key) {
					values[key] = that.values[key].value;
				});

				return values;
			},
			getValue: function(key) {

				return this.values[key].value;
			},
			bindErrors: function(errors, callback) {

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

					if (callback) { callback(); }

				} else { if (callback) { callback(); } }
			},
			clearErrors: function(callback) {

				var that = this;

				angular.forEach(that.keys, function(key) {

					that.values[key].error = null;
					that.values[key].errorType = null;
				});

				if (callback) { callback(); }
			},
			setRestObj: function(restObj, cb) {

				var that = this;

				angular.forEach(that.keys, function(key) {
					restObj[key] = that.values[key].value;
				});

				if (cb) { cb(); }
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
					settings = { title: $rootScope.hardData.phrases[109], acceptCb: acceptCb };
					$rootScope.ui.modals.confirmProceedModal.show(settings);
					break;

				case 'MAX_FILES_UPLOADED':
					settings = { title: username, message: $rootScope.hardData.sentences[30] };
					$rootScope.ui.modals.infoModal.show(settings);
					break;

				case 'UPLOADING_TOO_MANY_FILES':
					settings = { title: username, message: $rootScope.hardData.sentences[31] };
					$rootScope.ui.modals.infoModal.show(settings);
					break;

				case 'filenameAlreadyExists':
					settings = { title: username, message: $rootScope.hardData.sentences[32] };
					$rootScope.ui.modals.infoModal.show(settings);
					break;

				case 'WRONG_FILE_TYPE':
					settings = { title: username, message: $rootScope.hardData.sentences[25] };
					$rootScope.ui.modals.infoModal.show(settings);
					break;

				case 'FILE_TOO_LARGE':
					settings = { title: username, message: $rootScope.hardData.sentences[26] + this.maxFileSize / 1024 / 1024 + ' Mb.' };
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
					message: $rootScope.hardData.sentences[35],
					hideCb: function() { cb(false); }
				});

			} else {

				// Showing confirmation modal
				$rootScope.ui.modals.confirmProceedModal.show({
					title: $rootScope.hardData.phrases[109],
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

	var ItemCategoriesRest = function(Restangular) {
		return Restangular.service('item_categories');
	};

	ItemCategoriesRest.$inject = ['Restangular'];
	angular.module('appModule').factory('ItemCategoriesRest', ItemCategoriesRest);

})();
(function() {

	'use strict';

	var UsersRest = function($rootScope, Restangular) {

		var users = Restangular.service('users');

		Restangular.extendModel('users', function(user) {

			user._isTheOneLoggedIn = function() {

				return user._id == $rootScope.apiData.loggedInUser._id;
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
					'loginForm', 'registerForm', 'recoverForm', 'passwordForm', 'deactivationForm', 'itemSearchForm',
					'contactForm', 'itemForm', 'auctionForm', 'commentForm'
				];

				var resetBtnForms = ['regionalForm', 'appearanceForm', 'personalDetailsForm'];

				$scope.myForm.showClearBtn = clearBtnForms.indexOf($scope.myForm.ctrlId) > -1;
				$scope.myForm.showResetBtn = resetBtnForms.indexOf($scope.myForm.ctrlId) > -1;

				switch ($scope.myForm.ctrlId) {

					case 'itemForm':
					case 'auctionForm':
						$scope.myForm.submitBtnPhraseIndex = 1;
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

					case 'itemSearchForm':
						$scope.myForm.submitBtnPhraseIndex = 83;
						break;
				}



				$scope.onSubmit = function() { $scope.myForm.submit(); };
				$scope.onClear = function() { $scope.myForm.clear(); };
				$scope.onReset = function() { $scope.myForm.reset(); };
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



	appModule.directive('itemSearchForm', function($rootScope, myClass) {

		var itemSearchForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/itemSearchForm/itemSearchForm.html',
			scope: true,
			controller: function($scope) {

				$scope.itemCategories = $rootScope.apiData.itemCategories;

				$scope.myForm = new myClass.MyForm({
					ctrlId: 'itemSearchForm',
					noLoader: true,
					model: $rootScope.globalFormModels.itemSearchModel,
					submitAction: function(args) {

						$rootScope.$broadcast('initSearchItems');
					}
				});
			}
		};

		return itemSearchForm;
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
								$state.go('guest.1', { tab: 'status' });
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



	appModule.directive('personalDetailsForm', function($rootScope, fileService, MyForm, Restangular) {

		var personalDetailsForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/personalDetailsForm/personalDetailsForm.html',
			scope: true,
			controller: function($scope) {

				$scope.countries = fileService.countries;

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



	appModule.directive('registerForm', function($rootScope, $timeout, $state, authService, fileService, MyForm, UsersRest) {

		var registerForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/registerForm/registerForm.html',
			scope: true,
			controller: function($scope) {

				$scope.countries = fileService.countries;

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
								$state.go('guest.1', { tab: 'status' });
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

				$scope.modalWindow = new MyModal({ id: 'imgCropModal', title: $rootScope.hardData.phrases[53] });
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

	appModule.directive('auctions', function($rootScope, auctionsConf) {

		var auctions = {
			restrict: 'E',
			templateUrl: 'public/directives/AUCTION/auctions/auctions.html',
			scope: {
				ctrlId: '@'
			},
			controller: function($scope) {

				$scope.hardData = $rootScope.hardData;
				$scope.apiData = $rootScope.apiData;

				$scope.init = function() {

					$scope.elemContextMenuConf = auctionsConf.auctionContextMenuConf;

					switch ($scope.ctrlId) {

						case 'UserAuctions':
							$scope.collectionBrowser = auctionsConf.userAuctionsBrowser;
							break;

						case 'ItemAuctions':
							$scope.collectionBrowser = auctionsConf.itemAuctionsBrowser;
							break;
					}

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

		return auctions;
	});

})();
(function() {

	'use strict';

	var auctionsConf = function($rootScope, $state, auctionsService, hardDataService, myClass, AuctionsRest) {

		var hardData = hardDataService.get();

		this.userAuctionsBrowser = new myClass.MyCollectionBrowser({
			singlePageSize: 3,
			filterer: {
				switchers: [
					{
						_id: 'all',
						label: hardData.phrases[76]
					}
				]
			},
			sorter: {
				switchers: [
					{
						_id: 'dateAdded',
						label: hardData.phrases[137]
					},
					{
						_id: 'currency',
						label: hardData.phrases[102]
					},
					{
						_id: 'initialValue',
						label: hardData.phrases[85]
					},
					{
						_id: 'bidIncrement',
						label: hardData.phrases[99]
					},
					{
						_id: 'minSellPrice',
						label: hardData.phrases[100]
					},
					{
						_id: 'amount',
						label: hardData.phrases[104]
					}
				]
			},
			fetchData: function(query) {

				query.userId = $rootScope.apiData.profileUser._id;
				return AuctionsRest.getList(query);
			}
		});

		this.itemAuctionsBrowser = new myClass.MyCollectionBrowser({
			singlePageSize: 3,
			filterer: {
				switchers: [
					{
						_id: 'all',
						label: hardData.phrases[76]
					}
				]
			},
			sorter: {
				switchers: [
					{
						_id: 'dateAdded',
						label: hardData.phrases[137]
					},
					{
						_id: 'currency',
						label: hardData.phrases[102]
					},
					{
						_id: 'initialValue',
						label: hardData.phrases[85]
					},
					{
						_id: 'bidIncrement',
						label: hardData.phrases[99]
					},
					{
						_id: 'minSellPrice',
						label: hardData.phrases[100]
					},
					{
						_id: 'amount',
						label: hardData.phrases[104]
					}
				]
			},
			fetchData: function(query) {

				query.itemId = $rootScope.apiData.item._id;
				return AuctionsRest.getList(query);
			}
		});



		var onSubscribeStatusChange = function(that) {

			that.parent.data['_' + that._id]().then(function() {

				switch ($state.current.name) {

					case 'main.profile':
						$rootScope.$broadcast('initUserAuctions');
						break;

					case 'main.item':
						$rootScope.$broadcast('initItemAuctions');
						break;
				}
			});
		};

		this.auctionContextMenuConf = {
			icon: 'glyphicon glyphicon-option-horizontal',
			switchers: [
				{
					_id: 'delete',
					label: hardData.phrases[14],
					onClick: function() {
						auctionsService.deleteAuctions([this.parent.data]);
					},
					isHidden: function() {
						return !this.parent.data._isOwn();
					}
				},
				{
					_id: 'subscribe',
					label: hardData.phrases[101],
					onClick: function() {
						onSubscribeStatusChange(this);
					},
					isHidden: function() {
						return this.parent.data._isOwn() || this.parent.data._haveSubscribed();
					}
				},
				{
					_id: 'unsubscribe',
					label: hardData.phrases[105],
					onClick: function() {
						onSubscribeStatusChange(this);
					},
					isHidden: function() {
						return this.parent.data._isOwn() || !this.parent.data._haveSubscribed();
					}
				}
			]
		};

		return this;
	};



	auctionsConf.$inject = ['$rootScope', '$state', 'auctionsService', 'hardDataService', 'myClass', 'AuctionsRest'];
	angular.module('appModule').service('auctionsConf', auctionsConf);

})();
(function() {

	'use strict';

	var AuctionsRest = function($rootScope, Restangular) {

		var auctions = Restangular.service('auctions');

		Restangular.extendModel('auctions', function(auction) {

			auction._subscribe = function() {

				var copy = Restangular.copy(auction);
				copy.subscribers.push($rootScope.apiData.loggedInUser._id);
				return copy.put();
			};

			auction._unsubscribe = function() {

				var copy = Restangular.copy(auction);
				copy.subscribers.splice(copy.subscribers.indexOf($rootScope.apiData.loggedInUser._id), 1);
				return copy.put();
			};

			auction._placeBid = function() {

				return auction.put(undefined, { action: 'place_bid' });
			};

			auction._isOwn = function() {

				if (auction.item) {
					return auction.item.userId == $rootScope.globalFormModels.personalDetailsModel.getValue('_id');

				} else {
					return $rootScope.apiData.item.userId == $rootScope.globalFormModels.personalDetailsModel.getValue('_id');
				}
			};

			auction._haveSubscribed = function() {

				var userId = $rootScope.globalFormModels.personalDetailsModel.getValue('_id');
				return auction.subscribers.indexOf(userId) > -1;
			};

			return auction;
		});



		return auctions;
	};

	AuctionsRest.$inject = ['$rootScope', 'Restangular'];
	angular.module('appModule').factory('AuctionsRest', AuctionsRest);

})();
(function() {

	'use strict';

	var auctionsService = function($rootScope, $q) {

		this.deleteAuctions = function(auctions) {

			if (auctions && auctions.length > 0) {

				var promises = [];

				for (var auction of auctions) {
					promises.push(auction.remove());
				}

				$q.all(promises).then(function(results) {
					$rootScope.$broadcast('initItemAuctions');
				});
			}
		};

		this.placeBid = function() {};

		return this;
	};

	auctionsService.$inject = ['$rootScope', '$q'];
	angular.module('appModule').service('auctionsService', auctionsService);

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	var subscribers;

	appModule.directive('auctionSubscribersWindow', function($rootScope, $state, MySrcCollection, UsersRest, URLS) {
		return {
			restrict: 'E',
			templateUrl: 'public/directives/AUCTION/auctionSubscribersWindow/auctionSubscribersWindow.html',
			scope: {
				myModal: '='
			},
			controller: function($scope) {

				$scope.hardData = $rootScope.hardData;

				$scope.srcCollection = new MySrcCollection({
					constructUrl: function(i) {
						return URLS.AWS3_RESIZED_UPLOADS_BUCKET_URL + 'resized-' + subscribers[i]._id + '/' + subscribers[i].photos[0].filename;
					}
				});
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					$rootScope.$on('auctionSubscribersWindowOpen', function() {

						var onSingleSrcClick = function() {

							var that = this;

							$rootScope.ui.modals.auctionSubscribersModal.hide(function() {
								$state.go('main.profile', { id: that._id });
							});
						};

						UsersRest.getList({ auctionId: $rootScope.apiData.auction._id }).then(function(res) {

							subscribers = res.data.plain();

							scope.srcCollection.init(subscribers, function() {
								for (var i in scope.srcCollection.collection) {
									scope.srcCollection.collection[i].onClick = onSingleSrcClick;
									scope.srcCollection.collection[i].label = subscribers[i].username;
								}
							});

						}, function(res) {});
					});

					scope.onRefreshBtnClick = function() {
						$rootScope.$broadcast('auctionSubscribersWindowOpen');
					};
				};
			}
		};
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('auctionWindow', function($rootScope, ui, myClass, AuctionsRest) {

		var auctionWindow = {
			restrict: 'E',
			templateUrl: 'public/directives/AUCTION/auctionWindow/auctionWindow.html',
			scope: {},
			controller: function($scope) {

				$scope.currencies = $rootScope.hardData.currencies;

				$scope.myModal = new myClass.MyModal({ id: 'auctionModal', title: $rootScope.hardData.phrases[120] });
				$scope.myModel = new myClass.MyFormModel('auctionModel', ['itemId', 'currency', 'initialValue', 'bidIncrement', 'minSellPrice', 'amount'], true);

				$scope.myForm = new myClass.MyForm({
					ctrlId: 'auctionForm',
					model: $scope.myModel,
					submitAction: function(args) {

						$scope.myModel.setValue('itemId', $rootScope.apiData.item._id);
						return AuctionsRest.post($scope.myModel.getValues());
					},
					submitSuccessCb: function(res) {

						$scope.myModal.hide(function() {
							$rootScope.$broadcast('initItemAuctions');
						});
					}
				});
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					$rootScope.$on('displayAddAuctionWindow', function(e, args) {
						scope.myModel.set({});
						scope.myModel.clearErrors();
						scope.myModal.show();
					});
				};
			}
		};

		return auctionWindow;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('biddingMachine', function($rootScope, auctionsService) {

		var socket;

		var biddingMachine = {
			restrict: 'E',
			templateUrl: 'public/directives/AUCTION/biddingMachine/biddingMachine.html',
			scope: {
				item: '='
			},
			controller: function($scope) {

				$scope.onIncreaseBtnClick = function() {

					$scope.bid += $scope.item.bidIncrement;
				};

				$scope.onDecreaseBtnClick = function() {

					if ($scope.bid > $scope.item.initialValue) {
						$scope.bid -= $scope.item.bidIncrement;
					}
				};

				$scope.onPlaceBidBtnClick = function() {


				};
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					socket = $rootScope.socket;

					scope.$watch(function() { return scope.item; }, function(item) {

						if (item) {
							scope.bid = scope.item.initialValue;
						}
					});
				};
			}
		};

		return biddingMachine;
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
						return CommentsRest.post($scope.myForm.model.getValues(), { itemId: $rootScope.apiData.item._id });
					},
					submitSuccessCb: function(res) {

						$scope.myForm.model.clear();
						$rootScope.$broadcast('initItemComments');
					}
				});

				$scope.init = function() {

					$scope.collectionBrowser = commentsConf.itemCommentsBrowser;
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
					label: hardData.phrases[68],
					onClick: function() {

					}
				},
				{
					_id: 'delete',
					label: hardData.phrases[14],
					onClick: function() {

						this.parent.data.remove({ itemId: $rootScope.apiData.item._id }).then(function() {
							$rootScope.$broadcast('initItemComments');
						});
					}
				}
			]
		};

		this.itemCommentsBrowser = new myClass.MyCollectionBrowser({
			singlePageSize: 10,
			fetchData: function(query) {

				if ($rootScope.apiData.item) {
					query.itemId = $rootScope.apiData.item._id;
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

	appModule.directive('itemAvatar', function(itemAvatarService, itemAvatarConf, MySrc) {

		var itemAvatar = {
			restrict: 'E',
			templateUrl: 'public/directives/ITEM/itemAvatar/itemAvatar.html',
			scope: {
				item: '='
			},
			controller: function($scope) {

				$scope.src = new MySrc({ defaultUrl: itemAvatarConf.defaultUrl });
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					scope.$watch(function() { return scope.item; }, function(item) {

						if (item) {
							scope.src.href = '/#/item/photos?id=' + item._id;
							scope.src.load(itemAvatarService.constructPhotoUrl(scope, true));
						}
					});
				};
			}
		};

		return itemAvatar;
	});

})();
(function() {

	'use strict';

	var itemAvatarConf = function() {

		var conf = {
			defaultUrl: 'public/imgs/item.png'
		};

		return conf;
	};



	itemAvatarConf.$inject = [];
	angular.module('appModule').service('itemAvatarConf', itemAvatarConf);

})();
(function() {

	'use strict';

	var itemAvatarService = function(URLS) {

		var service = {
			constructPhotoUrl: function(scope, useThumb) {

				if (!scope.item.avatarFileName) { return scope.src.defaultUrl; }

				if (!useThumb) {
					return URLS.AWS3_UPLOADS_BUCKET_URL + scope.item.userId + '/items/' + scope.item._id + '/' + scope.item.avatarFileName;

				} else {
					return URLS.AWS3_RESIZED_UPLOADS_BUCKET_URL + 'resized-' + scope.item.userId + '/items/' + scope.item._id + '/' + scope.item.avatarFileName;
				}
			}
		};

		return service;
	};

	itemAvatarService.$inject = ['URLS'];
	angular.module('appModule').service('itemAvatarService', itemAvatarService);

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('itemIconMenu', function($rootScope, ui) {

		var itemIconMenu = {
			restrict: 'E',
			templateUrl: 'public/directives/ITEM/itemIconMenu/itemIconMenu.html',
			scope: {
				item: '='
			},
			controller: function($scope) {

				$scope.personalDetailsModel = $rootScope.globalFormModels.personalDetailsModel;
 				$scope.mainFrame = ui.frames.main;
			}
		};

		return itemIconMenu;
	});

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('itemPhotos', function($rootScope, itemPhotosService, itemPhotosConf, MySrcCollection, MySrcAction, NUMS) {

		var itemPhotos = {
			restrict: 'E',
			templateUrl: 'public/directives/ITEM/itemPhotos/itemPhotos.html',
			scope: {
				item: '=',
				editable: '&'
			},
			controller: function($scope) {

				$scope.srcAction = new MySrcAction({
					acceptedFiles: 'image/png,image/jpg,image/jpeg',
					maxFiles: NUMS.itemMaxPhotos,
					maxFileSize: NUMS.photoMaxSize,
					getFilesCount: function() {
						return $rootScope.apiData.item.photos.length;
					}
				});

				// Initializing context menus
				$scope.mainContextMenuConf = itemPhotosConf.getMainContextMenuConf($scope);
				$scope.srcContextMenuConf = itemPhotosConf.getSrcContextMenuConf($scope);
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					// Watching current item
					scope.$watch(function() { return scope.item; }, function(item) {

						if (item) {

							// Instantiating

							scope.srcThumbsCollection = new MySrcCollection({
								defaultUrl: itemPhotosConf.defaultUrl,
								constructUrl: function(i) {
									return itemPhotosService.constructPhotoUrl(scope.item.userId, scope.item._id, scope.item.photos[i].filename, true);
								},
								uploadRequest: itemPhotosService.uploadRequest,
								remove: function(indexes) {

									for (var i = indexes.length - 1; i >= 0; i--) {
										scope.item.photos.splice(indexes[i], 1);
									}

									return scope.item.put();
								}
							});

							scope.srcSlidesCollection = new MySrcCollection({
								defaultUrl: itemPhotosConf.defaultUrl,
								constructUrl: function(i) {
									return itemPhotosService.constructPhotoUrl(scope.item.userId, scope.item._id, scope.item.photos[i].filename, false);
								}
							});

							// Initializing

							scope.srcThumbsCollection.init(scope.item.photos);

							scope.srcSlidesCollection.init(scope.item.photos, function() {
								for (var i in scope.srcSlidesCollection.collection) {
									scope.srcSlidesCollection.collection[i].href = scope.srcSlidesCollection.collection[i].url;
								}
							});
						}
					});
				};
			}
		};

		return itemPhotos;
	});

})();
(function() {

	'use strict';

	var itemPhotosConf = function($rootScope, itemPhotosService) {

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
							label: $rootScope.hardData.phrases[16],
							onClick: function() {

								if (scope.srcAction.getFilesCount() < scope.srcAction.maxFiles) {
									$rootScope.$broadcast('displayMultipleFilesInput', {
										cb: function(files) {
											itemPhotosService.update('addToSet', scope, files);
										}
									});

								} else {
									scope.srcAction.displayModalMessage('MAX_FILES_UPLOADED');
								}
							}
						},
						{
							_id: 'delete',
							label: $rootScope.hardData.phrases[14],
							onClick: function() {
								itemPhotosService.delete('multiple', scope);
							},
							isHidden: isHidden
						},
						{
							_id: 'refresh',
							label: $rootScope.hardData.phrases[106],
							onClick: function() {
								scope.srcThumbsCollection.init(scope.item.photos);
							},
							isHidden: isHidden
						},
						{
							_id: 'select_all',
							label: $rootScope.hardData.phrases[107],
							onClick: function() {
								scope.srcThumbsCollection.selectAll();
							},
							isHidden: isHidden
						},
						{
							_id: 'deselect_all',
							label: $rootScope.hardData.phrases[110],
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
						itemPhotosService.afterUpdateSync(scope);
					});
				};

				return {
					icon: 'glyphicon glyphicon-option-horizontal',
					switchers: [
						{
							_id: 'updateSingle',
							label: $rootScope.hardData.phrases[5],
							onClick: function() {

								var that = this;

								$rootScope.$broadcast('displaySingleFileInput', {
									cb: function(files) {
										itemPhotosService.update('updateSingle', scope, files, that.parent.data);
									}
								});
							}
						},
						{
							_id: 'delete',
							label: $rootScope.hardData.phrases[14],
							onClick: function() {
								itemPhotosService.delete('single', scope, this.parent.data);
							}
						},
						{
							_id: 'refresh',
							label: $rootScope.hardData.phrases[106],
							onClick: function() {
								this.parent.data.load(undefined, true);
							}
						},
						{
							_id: 'moveLeft',
							label: $rootScope.hardData.phrases[135],
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
							label: $rootScope.hardData.phrases[136],
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
							label: $rootScope.hardData.phrases[108],
							onClick: function() {

								scope.item.avatarFileName = this.parent.data.filename;
								itemPhotosService.afterUpdateSync(scope);
							}
						}
					]
				};
			}
		};

		return conf;
	};

	itemPhotosConf.$inject = ['$rootScope', 'itemPhotosService'];
	angular.module('appModule').service('itemPhotosConf', itemPhotosConf);

})();
(function() {

	'use strict';

	var itemPhotosService = function($rootScope, $q, aws3Service, MySrcAction, ItemsRest, Restangular, URLS) {

		var self = {
			constructPhotoUrl: function(userId, itemId, filename, useThumb) {

				if (!useThumb) {
					return URLS.AWS3_UPLOADS_BUCKET_URL + userId + '/items/' + itemId + '/' + filename;

				} else {
					return URLS.AWS3_RESIZED_UPLOADS_BUCKET_URL + 'resized-' + userId + '/items/' + itemId + '/' + filename;
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

						var item = $rootScope.apiData.item;

						resolve({
							success: true,
							url: self.constructPhotoUrl(item.userId, item._id, src.filename, true)
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
						aws3Service.getCredentials('item_photos', { itemId: $rootScope.apiData.item._id, 'fileTypes': fileTypes }).then(function(res) {

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
						ItemsRest.getList({ _id: $rootScope.apiData.item._id });
					}
				});
			},
			afterUpdateSync: function(scope, cb) {

				var copy = Restangular.copy($rootScope.apiData.item);

				copy.photos = [];

				for (var i in scope.srcThumbsCollection.collection) {
					copy.photos[i] = {
						filename: scope.srcThumbsCollection.collection[i].filename,
						size: scope.srcThumbsCollection.collection[i].size
					};
				}

				copy.put().then(function(res) {
					$rootScope.apiData.item = res.data;
					if (cb) { cb(true); }

				}, function(res) {
					if (cb) { cb(false); }
				});
			}
		};

		return self;
	};

	itemPhotosService.$inject = ['$rootScope', '$q', 'aws3Service', 'MySrcAction', 'ItemsRest', 'Restangular', 'URLS'];
	angular.module('appModule').service('itemPhotosService', itemPhotosService);

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('items', function($rootScope, itemsConf, itemsService) {

		var items = {
			restrict: 'E',
			templateUrl: 'public/directives/ITEM/items/items.html',
			scope: {
				ctrlId: '@'
			},
			controller: function($scope) {

				$scope.hardData = $rootScope.hardData;
				$scope.apiData = $rootScope.apiData;

				$scope.deleteElems = function() {

					itemsService.deleteItems($scope.collectionBrowser.getSelectedCollection());
				};
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					switch (scope.ctrlId) {

						case 'UserItems':

							scope.collectionBrowser = itemsConf.profileCollectionBrowser;
							scope.elemContextMenuConf = itemsConf.itemContextMenuConf;

							scope.$watch('apiData.profileUser._id', function(userId) {
								if (angular.isDefined(userId)) {
									scope.collectionBrowser.init();
								}
							});

							break;

						case 'SearchItems':

							scope.collectionBrowser = itemsConf.searchCollectionBrowser;
							scope.collectionBrowser.init();
							break;
					}
				};
			}
		};

		return items;
	});

})();
(function() {

	'use strict';

	var itemsConf = function($rootScope, hardDataService, myClass, itemsService, ItemsRest) {

		var hardData = hardDataService.get();

		this.searchCollectionBrowser = new myClass.MyCollectionBrowser({
			singlePageSize: 25,
			filterer: {
				switchers: [
					{
						_id: 'all',
						label: hardData.phrases[76]
					},
					{
						_id: 'L',
						label: hardData.itemTypes[0].label
					},
					{
						_id: 'F',
						label: hardData.itemTypes[1].label
					}
				]
			},
			sorter: {
				switchers: [
					{
						_id: 'title',
						label: hardData.phrases[84]
					},
					{
						_id: 'dateAdded',
						label: hardData.phrases[137]
					}
				]
			},
			fetchData: function(query) {

				var model = $rootScope.globalFormModels.itemSearchModel.getValues();

				query.title = model.title;
				query.categoryId = model.categoryId;
				query.subcategoryId = model.subcategoryId;

				return ItemsRest.getList(query);
			}
		});

		this.profileCollectionBrowser = new myClass.MyCollectionBrowser({
			singlePageSize: 25,
			filterer: {
				switchers: [
					{
						_id: 'all',
						label: hardData.phrases[76]
					},
					{
						_id: 'L',
						label: hardData.itemTypes[0].label
					},
					{
						_id: 'F',
						label: hardData.itemTypes[1].label
					}
				]
			},
			sorter: {
				switchers: [
					{
						_id: 'title',
						label: hardData.phrases[84]
					},
					{
						_id: 'dateAdded',
						label: hardData.phrases[137]
					}
				]
			},
			fetchData: function(query) {

				query.userId = $rootScope.apiData.profileUser._id;
				return ItemsRest.getList(query);
			}
		});

		this.itemContextMenuConf = {
			icon: 'glyphicon glyphicon-option-horizontal',
			switchers: [
				{
					_id: 'edit',
					label: hardData.phrases[68],
					onClick: function() {
						$rootScope.$broadcast('displayEditItemWindow', { item: this.parent.data });
					}
				},
				{
					_id: 'delete',
					label: hardData.phrases[14],
					onClick: function() {
						itemsService.deleteItems([this.parent.data]);
					}
				}
			]
		};

		return this;
	};



	itemsConf.$inject = ['$rootScope', 'hardDataService', 'myClass', 'itemsService', 'ItemsRest'];
	angular.module('appModule').service('itemsConf', itemsConf);

})();
(function() {

	'use strict';

	var ItemsRest = function($rootScope, $stateParams, Restangular, storageService) {

		var items = Restangular.service('items');

		Restangular.extendModel('items', function(item) {

			item._isOwn = function() {

				return this.userId == $rootScope.globalFormModels.personalDetailsModel.getValue('_id');
			};

			return item;
		});



		return items;
	};

	ItemsRest.$inject = ['$rootScope', '$stateParams', 'Restangular', 'storageService'];
	angular.module('appModule').factory('ItemsRest', ItemsRest);

})();
(function() {

	'use strict';

	var itemsService = function($rootScope, $state, $stateParams, $timeout, $q, Restangular) {

		var service = this;

		service.deleteItems = function(items) {

			if (items && items.length > 0) {

				// Showing confirm modal
				$rootScope.ui.modals.deleteItemModal.show({
					message: (function() { return $rootScope.hardData.sentences[48]; })(),
					acceptCb: function() {

						var promises = [];
						for (var item of items) { promises.push(item.remove({ userId: item.userId })); }

						$q.all(promises).then(function(results) {

							switch ($state.current.name) {

								case 'main.profile':
									$rootScope.$broadcast('initUserItems', { userId: $stateParams.id });
									break;

								case 'main.item':
									$state.go('main.profile', { id: item.userId });
									break;
							}
						});
					}
				});
			}
		};

		return service;
	};



	itemsService.$inject = ['$rootScope', '$state', '$stateParams', '$timeout', '$q', 'Restangular'];
	angular.module('appModule').service('itemsService', itemsService);

})();
(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('itemWindow', function($rootScope, $timeout, $state, myClass, Restangular, ItemsRest) {

		var actionMethodName;

		var itemWindow = {
			restrict: 'E',
			templateUrl: 'public/directives/ITEM/itemWindow/itemWindow.html',
			scope: true,
			controller: function($scope) {

				$scope.itemCategories = $rootScope.apiData.itemCategories;

				$scope.myModal = new myClass.MyModal({ id: 'itemModal', title: $rootScope.hardData.phrases[62] });
				$scope.myModel = new myClass.MyFormModel('itemModel', ['_id', 'userId', 'typeId', 'categoryId', 'subcategoryId', 'title', 'description'], true);
				$scope.myForm = new myClass.MyForm({ ctrlId: 'itemForm', model: $scope.myModel });



				$scope.addItem = function(args) {

					// Setting model userId value
					$scope.myModel.setValue('userId', $rootScope.globalFormModels.personalDetailsModel.getValue('_id'));

					$scope.myForm.submitSuccessCb = function(res) {
						$scope.myModal.hide(function() {
							$rootScope.$broadcast('initUserItems', { userId: $scope.myModel.getValue('userId') });
						});
					};

					// Making http request
					return ItemsRest.post($scope.myModel.getValues());
				};

				$scope.editItem = function(args) {

					// Making copy of active item
					var copy = Restangular.copy($rootScope.apiData.item);

					// Updating model values
					$scope.myModel.setRestObj(copy);

					$scope.myForm.submitSuccessCb = function(res) {

						$scope.myModal.hide(function() {

							$rootScope.apiData.item = undefined;

							$timeout(function() {

								$rootScope.apiData.item = res.data;

								if ($state.current.name == 'main.profile') {
									$rootScope.$broadcast('initUserItems', { userId: $rootScope.apiData.item.userId });
								}
							}, 300);
						});
					};

					$scope.myForm.submitErrorCb = function(res) {

						$rootScope.apiData.item = copy;
					};

					// Making request
					return copy.put();
				};

				$scope.myForm.submitAction = function(args) {

					return $scope[actionMethodName](args);
				};
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					scope.$on('displayAddItemWindow', function(e, args) {

						actionMethodName = 'addItem';
						scope.myForm.showResetBtn = false;

						scope.myModel.set({});
						scope.myModel.clearErrors();
						scope.myModal.show();
					});

					scope.$on('displayEditItemWindow', function(e, args) {

						var item;
						if (args && args.item) { $rootScope.apiData.item = args.item; }

						actionMethodName = 'editItem';
						scope.topText = '';
						scope.myForm.showResetBtn = true;

						scope.myModel.set($rootScope.apiData.item);
						scope.myModel.clearErrors();
						scope.myModal.show();
					});
				};
			}
		};

		return itemWindow;
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
				hideErrors: '='
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
								if (!scope.optionZero && !newValue) {
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

	appModule.directive('userAvatar', function(userAvatarService, userAvatarConf, MySrc, ui) {

		var userAvatar = {
			restrict: 'E',
			templateUrl: 'public/directives/USER/userAvatar/userAvatar.html',
			scope: {
				user: '=',
				editable: '=',
				noLabel: '&',
				noLink: '&'
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

							if (!scope.noLabel()) { scope.src.label = scope.user.truncatedUsername; }
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
							label: $rootScope.hardData.phrases[5],
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
							label: $rootScope.hardData.phrases[14],
							onClick: function() {

								scope.src.remove(undefined, true);
							},
							isHidden: function() { return scope.src.isDefaultUrlLoaded(); }
						},
						{
							_id: 'refresh',
							label: $rootScope.hardData.phrases[106],
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



	appModule.directive('userBadge', function($rootScope, $state, authService) {

		return {
			restrict: 'E',
			templateUrl: 'public/directives/USER/userBadge/userBadge.html',
			scope: true,
			controller: function($scope) {

				$scope.authState = authService.state;
				$scope.label1 = $rootScope.hardData.phrases[32];

				$scope.onLogoutClick = function() {
					$rootScope.logout();
				};

				$scope.onContinueClick = function() {
					$state.go('main.home');
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