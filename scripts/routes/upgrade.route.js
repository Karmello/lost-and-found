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
				getPayment: function(id, $q, $http, $rootScope, $moment, storageService) {

					return $q(function(resolve, reject) {

						var token = storageService.authToken.getValue();

						$http.get('/paypal/payment', { headers: { 'x-access-token': token } }).success(function(res) {

							$rootScope.apiData.payment = {
								paymentId: res.id,
								date: $moment(res.create_time).format('DD-MM-YYYY, HH:mm'),
								paymentMethod: res.payer.payment_method,
								amount: res.transactions[0].amount.total,
								currency: res.transactions[0].amount.currency,
								creditCardType: res.payer.funding_instruments[0].credit_card.type,
								creditCardNumber: res.payer.funding_instruments[0].credit_card.number,
								firstname: res.payer.funding_instruments[0].credit_card.first_name,
								lastname: res.payer.funding_instruments[0].credit_card.last_name,
								creditCardExpireMonth: res.payer.funding_instruments[0].credit_card.expire_month,
								creditCardExpireYear: res.payer.funding_instruments[0].credit_card.expire_year
							};

							resolve();

						}).error(function(res) {
							reject();
						});
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