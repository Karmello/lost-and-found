(function() {

	'use strict';

	var contextMenuConf = function($rootScope, $state, reportsService) {

		this.reportContextMenuConf = {
			icon: 'glyphicon glyphicon-option-horizontal',
			switchers: [
				{
					_id: 'edit',
					label: $rootScope.hardData.imperatives[33],
					onClick: function() { $state.go('app.report', { id: this.parent.data._id, edit: '1' }); }
				},
				{
					_id: 'delete',
					label: $rootScope.hardData.imperatives[14],
					onClick: function() { reportsService.deleteReports([this.parent.data]); }
				}
			]
		};

		this.profileReportsContextMenuConf = {
			icon: 'glyphicon glyphicon-option-horizontal',
			switchers: [
				{
					_id: 'add',
					label: $rootScope.hardData.imperatives[16],
					onClick: function() { $state.go('app.newreport'); }
				},
				{
					_id: 'select_all',
					label: $rootScope.hardData.imperatives[30],
					onClick: function() { reportsService.collectionBrowser.byUser.selectAll(); }
				},
				{
					_id: 'deselect_all',
					label: $rootScope.hardData.imperatives[29],
					onClick: function() { reportsService.collectionBrowser.byUser.deselectAll(); }
				},
				{
					_id: 'delete',
					label: $rootScope.hardData.imperatives[31],
					onClick: function() {

						var selectedReports = reportsService.collectionBrowser.byUser.getSelectedCollection();
						if (selectedReports.length > 0) { reportsService.deleteReports(selectedReports); }
					}
				}
			]
		};

		return this;
	};

	contextMenuConf.$inject = ['$rootScope', '$state', 'reportsService'];
	angular.module('appModule').service('contextMenuConf', contextMenuConf);

})();