angular.module('appModule').directive('appearanceForm', function($rootScope, MyForm, Restangular, UsersRest) {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/appearanceForm.html',
    scope: true,
    controller: function($scope) {

      $scope.myForm = new MyForm({
        model: UsersRest.configModel,
        reload: true,
        onSubmit: function(args) {

          var copy = Restangular.copy($rootScope.apiData.loggedInUser);
          UsersRest.configModel.assignTo(copy);
          return copy.put(undefined, { action: 'userConfigUpdate' });
        }
      }, $scope);
    }
  };
});