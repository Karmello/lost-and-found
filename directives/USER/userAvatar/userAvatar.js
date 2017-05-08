(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('userAvatar', function(userAvatarService, userAvatarConf, MySrc, ui) {

		var userAvatar = {
			restrict: 'E',
			templateUrl: 'public/directives/USER/userAvatar/userAvatar.html',
			scope: {
				user: '=',
				editable: '&',
				noLabel: '&',
				noLink: '&'
			},
			controller: function($scope) {

				$scope.src = new MySrc({
					defaultUrl: userAvatarConf.defaultUrl,
					uploadRequest: userAvatarService.uploadRequest,
					removeRequest: userAvatarService.removeRequest
				});

				if ($scope.editable()) {
					$scope.srcContextMenuConf = userAvatarConf.getSrcContextMenuConf($scope);
				}
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					scope.$watch(function() { return scope.user; }, function(user) {

						if (user) {

							if (!scope.noLabel()) { scope.src.label = scope.user.truncatedUsername; }
							if (!scope.noLink()) { scope.src.href = '/#/user/items?id=' + scope.user._id; }

							userAvatarService.loadPhoto(scope);
						}
					});
				};
			}
		};

		return userAvatar;
	});

})();