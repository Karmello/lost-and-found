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

						$http.get('public/json/countries.json', { cache: true }).success(function(res) {

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