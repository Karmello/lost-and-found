(function() {

  'use strict';

  var appModule = angular.module('appModule');



  appModule.directive('passwordForm', function($rootScope, MyForm, UsersRest) {

    var passwordForm = {
      restrict: 'E',
      templateUrl: 'public/templates/passwordForm.html',
      scope: true,
      controller: function($scope) {

        $scope.myForm = new MyForm({
          ctrlId: 'passwordForm',
          model: UsersRest.passwordModel,
          submitAction: function(args) {

            return UsersRest.post(UsersRest.passwordModel.getValues(), { action: 'updatePass' });
          },
          submitSuccessCb: function(res) {

            UsersRest.passwordModel.reset(true, true);
          }
        });
      }
    };

    return passwordForm;
  });

})();