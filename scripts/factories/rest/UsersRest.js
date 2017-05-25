(function() {

	'use strict';

	var UsersRest = function($rootScope, Restangular, MyDataModel) {

		var users = Restangular.service('users');

		users.userModel = new MyDataModel({
			email: {},
			username: {},
			password: {},
			firstname: {},
			lastname: {},
			countryFirstLetter: {},
			country: {}
		});

		users.personalDetailsModel = new MyDataModel({
			_id: {},
			email: {},
			username: {},
			firstname: {},
			lastname: {},
			countryFirstLetter: {},
			country: {},
			registration_date: {}
		});

		users.passwordModel = new MyDataModel({
			currentPassword: {},
			password: {}
		});

		Restangular.extendModel('users', function(user) {

			user._isTheOneLoggedIn = function() {

				if ($rootScope.apiData.loggedInUser) {
					return user._id == $rootScope.apiData.loggedInUser._id;
				}
			};

			return user;
		});

		return users;
	};

	UsersRest.$inject = ['$rootScope', 'Restangular', 'MyDataModel'];
	angular.module('appModule').factory('UsersRest', UsersRest);

})();