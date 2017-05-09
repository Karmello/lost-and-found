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