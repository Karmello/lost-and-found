angular.module('appModule').directive('reportForm', function($rootScope, $timeout, reportFormService, ReportsRest) {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/reportForm.html',
    scope: {
      action: '@'
    },
    controller: function($scope) {

      $scope.ui = $rootScope.ui;
      $scope.apiData = $rootScope.apiData;
      $scope.hardData = $rootScope.hardData;

      $scope.autocomplete = {};
      $scope.minDate = new Date(2000, 0, 1);
      $scope.currentDate = reportFormService.getCurrentDateWithNoTime();

      $scope.myForm = reportFormService.getForm($scope);
    },
    compile: function(elem, attrs) {

      return function(scope, elem, attrs) {

        switch (scope.action) {

          case 'addReport':

            if (!$rootScope.$$listeners.onAddReportFormShow) {

              $rootScope.$on('onAddReportFormShow', function(e, args) {

                ReportsRest.addReportModel.set({ startEvent: { date: scope.currentDate } }, true);
              });
            }

            $rootScope.$broadcast('onAddReportFormShow');

            break;

          case 'respondToReport':

            if (!$rootScope.$$listeners.onRespondToReportFormShow) {

              $rootScope.$on('onRespondToReportFormShow', function(e, args) {

                var date = reportFormService.getCurrentDateWithNoTime();
                ReportsRest.respondToReportModel.set({ date: scope.currentDate }, true);
              });
            }

            break;

          case 'editReport':

            if (!$rootScope.$$listeners.onEditReportFormShow) {

              $rootScope.$on('onEditReportFormShow', function(e, args) {

                ReportsRest.editReportModel.set($rootScope.apiData.report.plain(), true);
                $timeout(function() { scope.myForm.loader.stop(); });
              });
            }

            break;
        }
      };
    }
  };
});