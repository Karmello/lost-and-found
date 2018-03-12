angular.module('appModule').directive('myDateInput', function() {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/myDateInput.html',
    scope: {
      ctrlId: '=',
      ctrlMaxLength: '=',
      ctrlMinValue: '=',
      ctrlMaxValue: '=',
      model: '=',
      hardData: '<',
      hideErrors: '=',
      isRequired: '='
    }
  };
});