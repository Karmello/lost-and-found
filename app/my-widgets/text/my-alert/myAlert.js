angular.module('appModule').directive('myAlert', function() {
  return {
    restrict: 'E',
    template: '<div id="myAlert" class="alert no_selection" ng-class="ctrlClass" role="alert" ng-bind="message" my-directive></div>',
    scope: {
      ctrlClass: '=',
      hardData: '<'
    }
  };
});