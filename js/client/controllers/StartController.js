(function() {

  'use strict';

  var StartController = function($scope, authService) {

    $scope.$watch(function() { return authService.state.loggedIn; }, function(loggedIn) {

      for (var i = 0; i < 3; i++) { $scope.ui.tabs.start.switchers[i].isVisible = !loggedIn; }
      $scope.ui.tabs.start.switchers[3].isVisible = loggedIn;
    });
  };

  StartController.$inject = ['$scope', 'authService'];
  angular.module('appModule').controller('StartController', StartController);

})();