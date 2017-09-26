(function() {

  'use strict';

  var appModule = angular.module('appModule');

  appModule.directive('appearanceForm', function($rootScope, MyForm, Restangular, UsersRest) {

    var appearanceForm = {
      restrict: 'E',
      templateUrl: 'public/templates/appearanceForm.html',
      scope: true,
      controller: function($scope) {

        $scope.myForm = new MyForm({
          ctrlId: 'appearanceForm',
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

    return appearanceForm;
  });

})();