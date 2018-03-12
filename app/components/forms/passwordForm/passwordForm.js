angular.module('appModule').directive('passwordForm', function($rootScope, MyForm, UsersRest) {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/passwordForm.html',
    scope: true,
    controller: function($scope) {

      $scope.myForm = new MyForm({
        model: UsersRest.passwordModel,
        onSubmit: function(args) {

          return UsersRest.post(UsersRest.passwordModel.getValues(), { action: 'updatePass' });
        },
        onSubmitSuccess: function(res) {

          UsersRest.passwordModel.reset(true, true);
        }
      }, $scope);
    }
  };
});