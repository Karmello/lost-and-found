(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app', {
			abstract: true,
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
				openExchangeRates: function($rootScope, $q, ui, exchangeRateService) {

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
				countries: function($q, $rootScope, ui, fileService) {

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
				deactivationReasons: function($rootScope, $q, $filter, DeactivationReasonsRest) {

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
				contactTypes: function($rootScope, $q, $filter, ui, ContactTypesRest) {

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
				reportCategories: function($q, $rootScope, ReportCategoriesRest, ui) {

					return $q(function(resolve, reject) {

						if (!$rootScope.apiData.reportCategories) {

							ReportCategoriesRest.getList().then(function(res) {

								$rootScope.apiData.reportCategories = res.data.plain();
								resolve();

							}, function() {

								ui.loaders.renderer.stop(function() {
									$rootScope.ui.modals.tryToRefreshModal.show();
								});
							});

						} else { resolve(); }
					});
				},
				getStats: function($http, $rootScope) {

					return $http.get('/stats').then(function(res) {
						$rootScope.apiData.stats = res.data;
					});
				},
				authentication: function(authService) {

					return authService.authenticate();
				}
			},
			onEnter: function(authentication, $location, $timeout, $state) {

				if (!authentication && $location.$$url.split('/') != 'start') {

					$timeout(function() {
						$state.go('app.start', { tab: 'login' }, { location: 'replace' });
					});
				}
			}
		});
	});

})();