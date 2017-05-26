(function() {

	'use strict';

	var contextMenuConf = function($rootScope, $state, reportsConf, reportsService) {

		this.reportContextMenuConf = {
			icon: 'glyphicon glyphicon-option-horizontal',
			switchers: [
				{
					_id: 'edit',
					label: $rootScope.hardData.imperatives[33],
					onClick: function() {

						$state.go('app.report', { id: this.parent.data._id, edit: '1' });
					}
				},
				{
					_id: 'delete',
					label: $rootScope.hardData.imperatives[14],
					onClick: function() {

						reportsService.deleteReports([this.parent.data]);
					}
				}
			]
		};

		this.profileReportsContextMenu = {
			icon: 'glyphicon glyphicon-option-horizontal',
			switchers: [
				{
					_id: 'select_all',
					label: $rootScope.hardData.imperatives[30],
					onClick: function() {

						reportsConf.userReports.selectAll();
					}
				},
				{
					_id: 'deselect_all',
					label: $rootScope.hardData.imperatives[29],
					onClick: function() {

						reportsConf.userReports.deselectAll();
					}
				},
				{
					_id: 'delete',
					label: $rootScope.hardData.imperatives[31],
					onClick: function() {

						var selectedReports = reportsConf.userReports.getSelectedCollection();
						if (selectedReports.length > 0) { reportsService.deleteReports(selectedReports); }
					}
				}
			]
		};

		return this;
	};

	contextMenuConf.$inject = ['$rootScope', '$state', 'reportsConf', 'reportsService'];
	angular.module('appModule').service('contextMenuConf', contextMenuConf);

})();