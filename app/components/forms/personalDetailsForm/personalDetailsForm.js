angular.module('appModule').directive('personalDetailsForm', function($rootScope, MyForm, UsersRest, Restangular) {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/personalDetailsForm.html',
    scope: true,
    controller: function($scope) {

      $scope.countries = $rootScope.localData.countries;

      $scope.myForm = new MyForm({
        model: UsersRest.personalDetailsModel,
        onSubmit: function(args) {

          var copy = Restangular.copy($rootScope.apiData.loggedInUser);
          $scope.myForm.model.assignTo(copy);
          return copy.put();
        },
        onSubmitSuccess: function(res) {

          var user = $rootScope.apiData.loggedInUser;
          var updated = res.config.data;

          user.email = updated.email;
          user.firstname = updated.firstname;
          user.lastname = updated.lastname;
          user.country = updated.country;
          user.photos = updated.photos;
        }
      }, $scope);
    }
  };
});