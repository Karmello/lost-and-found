angular.module('appModule').directive('loginForm', function($timeout, $state, authService, MyForm, UsersRest) {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/loginForm.html',
    scope: true,
    controller: function($scope) {

      $scope.myForm = new MyForm({
        model: UsersRest.loginModel,
        onSubmit: function(args) {

          var body = UsersRest.loginModel.getValues();
          return UsersRest.post(body, { action: 'login' }, { captcha_response: args.captchaResponse });
        },
        onSubmitSuccess: function(res) {

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