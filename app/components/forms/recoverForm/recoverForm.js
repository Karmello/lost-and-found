angular.module('appModule').directive('recoverForm', function($rootScope, $http, MyForm, UsersRest) {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/recoverForm.html',
    scope: true,
    controller: function($scope) {

      $scope.myForm = new MyForm({
        model: UsersRest.recoverModel,
        onSubmit: function(args) {

          var body = UsersRest.recoverModel.getValues();
          return $http.post('/recover', body, { headers: { captcha_response: args.captchaResponse } });
        },
        onSubmitSuccess: function(res) {

          $rootScope.$broadcast('infoModalShow', {
            title: res.data.msg.title,
            message: res.data.msg.info
          });
        }
      }, $scope);
    }
  };
});