angular.module('appModule').directive('registerForm', function($rootScope, $timeout, $state, authService, MyForm, UsersRest) {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/registerForm.html',
    scope: true,
    controller: function($scope) {

      $scope.countries = $rootScope.localData.countries;

      $scope.myForm = new MyForm({
        model: UsersRest.registerModel,
        onSubmit: function(args) {

          var body = UsersRest.registerModel.getValues();
          return UsersRest.post(body, { action: 'register' }, { captcha_response: args.captchaResponse });
        },
        onSubmitSuccess: function(res) {

          UsersRest.registerModel.reset(true, true);

          authService.setAsLoggedIn(function() {
            $timeout(function() {
              $state.go('app.start', { tab: 'status' });
            });
          });
        },
        onSubmitError: function(res) {

          authService.setAsLoggedOut();
        }
      }, $scope);
    }
  };
});