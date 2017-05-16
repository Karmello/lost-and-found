(function() {

	'use strict';

	var reportPhotosConf = function($rootScope, reportPhotosService) {

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
							label: $rootScope.hardData.imperatives[16],
							onClick: function() {

								if (scope.srcAction.getFilesCount() < scope.srcAction.maxFiles) {
									$rootScope.$broadcast('displayMultipleFilesInput', {
										cb: function(files) {
											reportPhotosService.update('addToSet', scope, files);
										}
									});

								} else {
									scope.srcAction.displayModalMessage('MAX_FILES_UPLOADED');
								}
							}
						},
						{
							_id: 'delete',
							label: $rootScope.hardData.imperatives[14],
							onClick: function() {
								reportPhotosService.delete('multiple', scope);
							},
							isHidden: isHidden
						},
						{
							_id: 'refresh',
							label: $rootScope.hardData.imperatives[19],
							onClick: function() {
								scope.srcThumbsCollection.init(scope.report.photos);
							},
							isHidden: isHidden
						},
						{
							_id: 'select_all',
							label: $rootScope.hardData.imperatives[30],
							onClick: function() {
								scope.srcThumbsCollection.selectAll();
							},
							isHidden: isHidden
						},
						{
							_id: 'deselect_all',
							label: $rootScope.hardData.imperatives[29],
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
						reportPhotosService.afterUpdateSync(scope);
					});
				};

				return {
					icon: 'glyphicon glyphicon-option-horizontal',
					switchers: [
						{
							_id: 'updateSingle',
							label: $rootScope.hardData.imperatives[5],
							onClick: function() {

								var that = this;

								$rootScope.$broadcast('displaySingleFileInput', {
									cb: function(files) {
										reportPhotosService.update('updateSingle', scope, files, that.parent.data);
									}
								});
							}
						},
						{
							_id: 'delete',
							label: $rootScope.hardData.imperatives[14],
							onClick: function() {
								reportPhotosService.delete('single', scope, this.parent.data);
							}
						},
						{
							_id: 'refresh',
							label: $rootScope.hardData.imperatives[19],
							onClick: function() {
								this.parent.data.load(undefined, true);
							}
						},
						{
							_id: 'moveLeft',
							label: $rootScope.hardData.imperatives[20],
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
							label: $rootScope.hardData.imperatives[21],
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
							label: $rootScope.hardData.imperatives[28],
							onClick: function() {

								scope.report.avatarFileName = this.parent.data.filename;
								reportPhotosService.afterUpdateSync(scope);
							}
						}
					]
				};
			}
		};

		return conf;
	};

	reportPhotosConf.$inject = ['$rootScope', 'reportPhotosService'];
	angular.module('appModule').service('reportPhotosConf', reportPhotosConf);

})();