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