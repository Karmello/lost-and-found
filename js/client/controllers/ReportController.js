(function() {

  'use strict';

  var ReportController = function($rootScope, $scope, $moment, $stateParams, reportsService, contextMenuConf) {

    $scope.params = $stateParams;
    $scope.$moment = $moment;

    $scope.$watch('apiData.report', function(report) {

      if (report && report._isOwn()) {
        $scope.contextMenuConf = contextMenuConf.reportContextMenuConf;

      } else {
        $scope.contextMenuConf = null;
      }
    });

    $scope.reportsService = reportsService;
    $scope.commentsOutData = {};

    $scope.showRespondToReportForm = function() {
      if (!$scope.isRespondToReportFormVisible) {
        $scope.isRespondToReportFormVisible = true;
        $rootScope.$broadcast('onRespondToReportFormShow');
      }
    };

    $rootScope.$on('toggleRespondToReportForm', function(e, args) {
      $scope.isRespondToReportFormVisible = args.visible;
    });
  };

  ReportController.$inject = ['$rootScope', '$scope', '$moment', '$stateParams', 'reportsService', 'contextMenuConf'];
  angular.module('appModule').controller('ReportController', ReportController);

})();