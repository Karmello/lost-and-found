(function() {

	'use strict';

	var userAvatarConf = function($rootScope, userAvatarService, utilService) {

		var conf = {
			defaultUrl: 'public/imgs/avatar.png',
			getSrcContextMenuConf: function(scope) {

				return {
					icon: 'glyphicon glyphicon-option-horizontal',
					switchers: [
						{
							_id: 'update',
							label: $rootScope.hardData.imperatives[5],
							onClick: function() {

								$rootScope.$broadcast('displayImgCropWindow', {
									acceptCb: function(dataURI) {

										scope.src.update({ file: utilService.dataURItoBlob(dataURI) }, true).then(function(success) {
											if (success) { userAvatarService.loadPhoto(scope, true); }
										});
									}
								});
							}
						},
						{
							_id: 'delete',
							label: $rootScope.hardData.imperatives[14],
							onClick: function() {

								scope.src.remove(undefined, true);
							},
							isHidden: function() { return scope.src.isDefaultUrlLoaded(); }
						},
						{
							_id: 'refresh',
							label: $rootScope.hardData.imperatives[19],
							onClick: function() {

								userAvatarService.loadPhoto(scope, true);
							}
						}
					]
				};
			}
		};

		return conf;
	};

	userAvatarConf.$inject = ['$rootScope', 'userAvatarService', 'utilService'];
	angular.module('appModule').service('userAvatarConf', userAvatarConf);

})();