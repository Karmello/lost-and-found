angular.module('appModule').directive('reportSearchForm', function($rootScope, MyForm, reportsService, ReportsRest) {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/reportSearchForm.html',
    scope: true,
    controller: function($scope) {

      $scope.reportCategories = $rootScope.hardData.reportCategories;

      $scope.myForm = new MyForm({
        model: ReportsRest.reportSearchModel,
        onSubmit: function(args) {

          reportsService.collectionBrowser.bySearchQuery.init();
        }
      }, $scope);
    }
  };
});