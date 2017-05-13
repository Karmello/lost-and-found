(function() {

	'use strict';

	var contextMenuConf = function($rootScope, $state, reportsConf, reportsService) {

		this.reportContextMenuConf = {
			icon: 'glyphicon glyphicon-option-horizontal',
			switchers: [
				{
					_id: 'edit',
					label: $rootScope.hardData.phrases[68],
					onClick: function() {

						$state.go('main.report', { id: this.parent.data._id, edit: '1' });
					}
				},
				{
					_id: 'delete',
					label: $rootScope.hardData.phrases[14],
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
					label: $rootScope.hardData.phrases[107],
					onClick: function() {

						reportsConf.profileCollectionBrowser.selectAll();
					}
				},
				{
					_id: 'deselect_all',
					label: $rootScope.hardData.phrases[110],
					onClick: function() {

						reportsConf.profileCollectionBrowser.deselectAll();
					}
				},
				{
					_id: 'delete',
					label: $rootScope.hardData.phrases[147],
					onClick: function() {

						var selectedReports = reportsConf.profileCollectionBrowser.getSelectedCollection();
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