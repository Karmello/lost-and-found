(function() {

	'use strict';

	var contextMenuConf = function($rootScope, $state, itemsConf, itemsService) {

		this.itemContextMenuConf = {
			icon: 'glyphicon glyphicon-option-horizontal',
			switchers: [
				{
					_id: 'edit',
					label: $rootScope.hardData.phrases[68],
					onClick: function() {

						$state.go('main.editem', { id: this.parent.data._id });
					}
				},
				{
					_id: 'delete',
					label: $rootScope.hardData.phrases[14],
					onClick: function() {

						itemsService.deleteItems([this.parent.data]);
					}
				}
			]
		};

		this.profileItemsContextMenu = {
			icon: 'glyphicon glyphicon-option-horizontal',
			switchers: [
				{
					_id: 'select_all',
					label: $rootScope.hardData.phrases[107],
					onClick: function() {

						itemsConf.profileCollectionBrowser.selectAll();
					}
				},
				{
					_id: 'deselect_all',
					label: $rootScope.hardData.phrases[110],
					onClick: function() {

						itemsConf.profileCollectionBrowser.deselectAll();
					}
				},
				{
					_id: 'delete',
					label: $rootScope.hardData.phrases[147],
					onClick: function() {

						var selectedItems = itemsConf.profileCollectionBrowser.getSelectedCollection();
						if (selectedItems.length > 0) { itemsService.deleteItems(selectedItems); }
					}
				}
			]
		};

		return this;
	};

	contextMenuConf.$inject = ['$rootScope', '$state', 'itemsConf', 'itemsService'];
	angular.module('appModule').service('contextMenuConf', contextMenuConf);

})();