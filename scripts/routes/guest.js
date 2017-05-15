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
				},
				reportCategories: function(countries, $q, $rootScope, ReportCategoriesRest, ui) {

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