(function() {

  'use strict';

  var appModule = angular.module('appModule');



  appModule.directive('regionalForm', function($rootScope, MyForm, UsersRest, Restangular) {

    var regionalForm = {
      restrict: 'E',
      templateUrl: 'public/templates/regionalForm.html',
      scope: true,
      controller: function($scope) {

        $scope.myForm = new MyForm({
          ctrlId: 'regionalForm',
          model: UsersRest.configModel,
          reload: true,
          submitAction: function(args) {

            var copy = Restangular.copy($rootScope.apiData.loggedInUser);
            UsersRest.configModel.assignTo(copy);
            return copy.put(undefined, { action: 'userConfigUpdate' });
          }
        });
      }
    };

    return regionalForm;
  });

})();