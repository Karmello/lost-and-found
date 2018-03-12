angular.module('appModule').directive('myInput', function() {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/myInput.html',
    scope: {
      ctrlId: '=',
      ctrlType: '=',
      ctrlMaxLength: '=',
      ctrlMinValue: '=',
      ctrlMaxValue: '=',
      model: '=',
      hardData: '<',
      hideErrors: '=',
      isDisabled: '='
    }
  };
});