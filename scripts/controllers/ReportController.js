(function() {

	'use strict';

	var ReportController = function($rootScope, $scope, $moment, $stateParams, reportsService, contextMenuConf, commentsConf) {

		$scope.params = $stateParams;
		$scope.$moment = $moment;

		$scope.$watch('apiData.report', function(report) {

			if (report && report._isOwn()) {
				$scope.reportContextMenuConf = contextMenuConf.reportContextMenuConf;

			} else {
				$scope.reportContextMenuConf = null;
			}
		});

		$scope.reportsService = reportsService;
		$scope.reportCommentsConf = commentsConf.reportCommentsConf;

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

	ReportController.$inject = ['$rootScope', '$scope', '$moment', '$stateParams', 'reportsService', 'contextMenuConf', 'commentsConf'];
	angular.module('appModule').controller('ReportController', ReportController);

})();