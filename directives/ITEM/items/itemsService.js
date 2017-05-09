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