(function() {

  'use strict';

  var UsersRest = function($rootScope, Restangular, MyDataModel) {

    var users = Restangular.service('users');

    users.loginModel = new MyDataModel({
      username: {},
      password: {}
    });

    users.registerModel = new MyDataModel({
      email: {},
      username: {},
      password: {},
      firstname: {},
      lastname: {},
      countryFirstLetter: {},
      country: {}
    });

    users.recoverModel = new MyDataModel({
      email: {}
    });

    users.personalDetailsModel = new MyDataModel({
      email: {},
      firstname: {},
      lastname: {},
      countryFirstLetter: {},
      country: {}
    });

    users.passwordModel = new MyDataModel({
      current: {},
      password: {}
    });

    users.configModel = new MyDataModel({
      config: {
        language: {},
        theme: {}
      }
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