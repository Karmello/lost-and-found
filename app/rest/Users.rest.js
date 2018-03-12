var UsersRest = function($rootScope, Restangular, MyFormModel) {

  var users = Restangular.service('users');

  users.loginModel = new MyFormModel({
    username: {},
    password: {}
  });

  users.registerModel = new MyFormModel({
    email: {},
    username: {},
    password: {},
    firstname: {},
    lastname: {},
    countryFirstLetter: {},
    country: {}
  });

  users.recoverModel = new MyFormModel({
    email: {}
  });

  users.personalDetailsModel = new MyFormModel({
    email: {},
    firstname: {},
    lastname: {},
    countryFirstLetter: {},
    country: {}
  });

  users.passwordModel = new MyFormModel({
    current: {},
    password: {}
  });

  users.configModel = new MyFormModel({
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

UsersRest.$inject = ['$rootScope', 'Restangular', 'MyFormModel'];
angular.module('appModule').factory('UsersRest', UsersRest);