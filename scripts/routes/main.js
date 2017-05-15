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
				reportCategories: function(contactTypes, $q, $rootScope, ReportCategoriesRest, ui) {

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