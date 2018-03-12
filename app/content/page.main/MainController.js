var MainController = function($scope, exchangeRateService, socketService, UsersRest) {

  $scope.exchangeRateService = exchangeRateService;

  $scope.$watch('apiData.loggedInUser', function(newUser) {

    if (newUser) {

      var user = newUser.plain();

      UsersRest.personalDetailsModel.set(user, true);
      UsersRest.personalDetailsModel.setValue('countryFirstLetter', newUser.country[0], true);
      UsersRest.configModel.set(user, true);

      socketService.init();
    }
  });
};

MainController.$inject = ['$scope', 'exchangeRateService', 'socketService', 'UsersRest'];
angular.module('appModule').controller('MainController', MainController);