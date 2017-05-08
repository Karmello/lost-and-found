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

								case 'main.user':
									$rootScope.$broadcast('initUserItems', { userId: $stateParams.id });
									break;

								case 'main.item':
									$state.go('main.user', { id: item.userId });
									break;
							}
						});
					}
				});
			}
		};

		service.makeItemPublic = function(item) {

			// Showing goPublic confirm modal
			$rootScope.ui.modals.makeItemPublicModal.show({
				acceptCb: function() {

					var copy = Restangular.copy(item);
					copy.isPublic = true;

					if ($state.current.name == 'main.item') { $rootScope.apiData.item = undefined; }

					// Making http request
					copy.put().then(function(res) {

						if ($state.current.name == 'main.item') {
							$rootScope.apiData.item = copy;

						} else {
							$rootScope.$broadcast('initUserItems', { userId: $stateParams.id });
						}

						$timeout(function() {
							$rootScope.ui.modals.itemMadePublicModal.show();
						}, 500);

					}, function(res) {
						$rootScope.ui.modals.tryAgainLaterModal.show();
					});
				}
			});
		};

		return service;
	};



	itemsService.$inject = ['$rootScope', '$state', '$stateParams', '$timeout', '$q', 'Restangular'];
	angular.module('appModule').service('itemsService', itemsService);

})();