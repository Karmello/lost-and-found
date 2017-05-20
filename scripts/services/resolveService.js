(function() {

	'use strict';

	var resolveService = function($q, $state, authService) {

		return {
			isAuthenticated: function() {

				return $q(function(resolve, reject) {

					if (authService.state.authenticated) {
						resolve();

					} else {
						reject();
						$state.go('app.start', { tab: 'status' }, { location: 'replace' });
					}
				});
			}
		};
	};

	resolveService.$inject = ['$q', '$state', 'authService'];
	angular.module('appModule').service('resolveService', resolveService);

})();