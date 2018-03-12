angular.module('appModule').directive('myCaptcha', function($timeout, myCaptchaService) {
  return {
    restrict: 'E',
    template: '<div id="{{ ctrlId }}" ng-show="visible" style="margin-bottom: 20px;" my-directive></div>',
    scope: {
      ctrlId: '=',
      actionName: '=',
    },
    controller: function($scope, $timeout) {

      $timeout(function() {

        // Loading captcha
        $scope.grecaptchaId = myCaptchaService.load($scope.ctrlId, $scope.actionName, function() {

          // When captcha resolved callback
          $timeout(function() { $scope.visible = false; }, 1000);
        });
      });
    },
    compile: function(elem, attrs) {
      return function(scope, elem, attrs) {

        // Getting parent form scope
        var form = $(elem).parents('.myForm:first');
        var formScope = $(form).scope();

        scope.$watch('visible', function(newValue) {
          if (newValue === true) { myCaptchaService.reset(scope.grecaptchaId); }
        });

        // Setting initial captcha visibility
        $timeout(function() {
          myCaptchaService.shouldBeVisible(scope.ctrlId, function(visible) {
            formScope.captcha = scope;
            scope.visible = visible;
          });
        });
      };
    }
  };
});