(function() {

	'use strict';

	var itemPhotosConf = function($rootScope, itemPhotosService) {

		var conf = {
			defaultUrl: 'public/imgs/item.png',
			getMainContextMenuConf: function(scope) {

				var isHidden = function() {
					if (scope.srcThumbsCollection) {
						return scope.srcThumbsCollection.collection.length === 0;
					}
				};

				return {
					icon: 'glyphicon glyphicon-option-horizontal',
					switchers: [
						{
							_id: 'update',
							label: $rootScope.hardData.phrases[16],
							onClick: function() {

								if (scope.srcAction.getFilesCount() < scope.srcAction.maxFiles) {
									$rootScope.$broadcast('displayMultipleFilesInput', {
										cb: function(files) {
											itemPhotosService.update('addToSet', scope, files);
										}
									});

								} else {
									scope.srcAction.displayModalMessage('MAX_FILES_UPLOADED');
								}
							}
						},
						{
							_id: 'delete',
							label: $rootScope.hardData.phrases[14],
							onClick: function() {
								itemPhotosService.delete('multiple', scope);
							},
							isHidden: isHidden
						},
						{
							_id: 'refresh',
							label: $rootScope.hardData.phrases[106],
							onClick: function() {
								scope.srcThumbsCollection.init(scope.item.photos);
							},
							isHidden: isHidden
						},
						{
							_id: 'select_all',
							label: $rootScope.hardData.phrases[107],
							onClick: function() {
								scope.srcThumbsCollection.selectAll();
							},
							isHidden: isHidden
						},
						{
							_id: 'deselect_all',
							label: $rootScope.hardData.phrases[110],
							onClick: function() {
								scope.srcThumbsCollection.deselectAll();
							},
							isHidden: isHidden
						}
					]
				};
			},
			getSrcContextMenuConf: function(scope) {

				var move = function(that) {
					scope.srcThumbsCollection.moveSingle(that._id, that.parent.data, function() {
						itemPhotosService.afterUpdateSync(scope);
					});
				};

				return {
					icon: 'glyphicon glyphicon-option-horizontal',
					switchers: [
						{
							_id: 'updateSingle',
							label: $rootScope.hardData.phrases[5],
							onClick: function() {

								var that = this;

								$rootScope.$broadcast('displaySingleFileInput', {
									cb: function(files) {
										itemPhotosService.update('updateSingle', scope, files, that.parent.data);
									}
								});
							}
						},
						{
							_id: 'delete',
							label: $rootScope.hardData.phrases[14],
							onClick: function() {
								itemPhotosService.delete('single', scope, this.parent.data);
							}
						},
						{
							_id: 'refresh',
							label: $rootScope.hardData.phrases[106],
							onClick: function() {
								this.parent.data.load(undefined, true);
							}
						},
						{
							_id: 'moveLeft',
							label: $rootScope.hardData.phrases[135],
							onClick: function() {
								move(this);
							},
							isHidden: function() {
								if (scope.srcThumbsCollection) {
									return scope.srcThumbsCollection.collection.length < 2;
								}
							}
						},
						{
							_id: 'moveRight',
							label: $rootScope.hardData.phrases[136],
							onClick: function() {
								move(this);
							},
							isHidden: function() {
								if (scope.srcThumbsCollection) {
									return scope.srcThumbsCollection.collection.length < 2;
								}
							}
						},
						{
							_id: 'set_as_avatar',
							label: $rootScope.hardData.phrases[108],
							onClick: function() {

								scope.item.avatarFileName = this.parent.data.filename;
								itemPhotosService.afterUpdateSync(scope);
							}
						}
					]
				};
			}
		};

		return conf;
	};

	itemPhotosConf.$inject = ['$rootScope', 'itemPhotosService'];
	angular.module('appModule').service('itemPhotosConf', itemPhotosConf);

})();