(function() {

	'use strict';

	var ReportController = function($scope, $stateParams, reportsService, contextMenuConf, commentsConf, MySwitchable) {

		$scope.params = $stateParams;

		$scope.$watch('apiData.report', function(report) {

			if (report && report._isOwn()) {
				$scope.reportContextMenu = new MySwitchable(contextMenuConf.reportContextMenuConf);
				$scope.reportContextMenu.data = report;

			} else {
				$scope.reportContextMenu = null;
			}
		});

		$scope.reportsService = reportsService;
		$scope.commentsBrowser = commentsConf.reportCommentsBrowser;
	};

	ReportController.$inject = ['$scope', '$stateParams', 'reportsService', 'contextMenuConf', 'commentsConf', 'MySwitchable'];
	angular.module('appModule').controller('ReportController', ReportController);

})();