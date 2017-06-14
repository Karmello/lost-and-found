(function() {

	'use strict';

	var reportPhotosConf = function($rootScope, reportPhotosService) {

		var conf = {
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
							label: $rootScope.hardData.imperatives[6],
							onClick: function() {

								if (scope.srcAction.getFilesCount() < scope.srcAction.maxFiles) {
									$rootScope.$broadcast('displayMyMultipleFilesInput', {
										cb: function(files) {
											reportPhotosService.uploadPhotos('addToSet', scope, files);
										}
									});

								} else {
									scope.srcAction.displayModalMessage('MAX_FILES_UPLOADED');
								}
							}
						},
						{
							_id: 'refresh',
							label: $rootScope.hardData.imperatives[19],
							onClick: function() {
								scope.srcThumbsCollection.init(scope.report.photos);
								reportPhotosService.initSlidesCollection(scope);
							}
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
						},
						{
							_id: 'delete',
							label: $rootScope.hardData.imperatives[31],
							onClick: function() {
								reportPhotosService.deletePhotos('multiple', scope);
							},
							isHidden: isHidden
						}
					]
				};
			},
			getSrcContextMenuConf: function(scope) {

				var move = function(that) {
					scope.srcThumbsCollection.moveSingle(that._id, that.parent.data, function() {
						reportPhotosService.syncDb(scope, function() {
							reportPhotosService.initSlidesCollection(scope);
						});
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

								$rootScope.$broadcast('displayMySingleFileInput', {
									cb: function(files) {
										reportPhotosService.uploadPhotos('updateSingle', scope, files, that.parent.data);
									}
								});
							}
						},
						{
							_id: 'delete',
							label: $rootScope.hardData.imperatives[14],
							onClick: function() {
								reportPhotosService.deletePhotos('single', scope, this.parent.data);
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

								var newAvatar = this.parent.data.filename;

								this.parent.data.load(undefined, true, function() {
									reportPhotosService.syncDb(scope, undefined, { newAvatar: newAvatar });
								});
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