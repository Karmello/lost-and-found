angular.module('appModule').directive('deactivationForm', function($rootScope, ui, MyForm, DeactivationReasonsRest, hardDataService) {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/deactivationForm.html',
    scope: true,
    controller: function($scope) {

      var hardData = hardDataService.get();

      $scope.myForm = new MyForm({
        model: DeactivationReasonsRest.deactivationReasonModel,
        onSubmit: function(args, cb) {

          return $rootScope.apiData.loggedInUser.remove(DeactivationReasonsRest.deactivationReasonModel.getValues());
        },
        onSubmitSuccess: function(res) {

          $rootScope.logout({ action: 'deactivation' });
        }
      }, $scope);

      $scope.onDeactivateClick = function() {

        if ($scope.myForm.model.getValue('deactivationReasonId')) {

          $rootScope.$broadcast('confirmDangerModalShow', {
            title: hardData.labels[24],
            message: hardData.warnings[1],
            acceptCb: function() {

              $rootScope.$broadcast('confirmDangerModalShow', {
                title: hardData.labels[24],
                message: hardData.warnings[3],
                acceptCb: function() {
                  $scope.myForm.submit();
                }
              });
            }
          });
        }
      };
    },
    compile: function(elem, attrs) {

      return function(scope, elem, attrs) {

        scope.$watch(function() { return $rootScope.apiData.deactivationReasons; }, function(newValue) {
          scope.deactivationReasons = newValue;
        });
      };
    }
  };
});