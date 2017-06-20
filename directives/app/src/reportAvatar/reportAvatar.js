(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('reportAvatar', function(reportAvatarService, MySrc, URLS) {

		var reportAvatar = {
			restrict: 'E',
			templateUrl: 'public/templates/reportAvatar.html',
			scope: {
				report: '=',
				noLink: '&',
				hideDefaultSrc: '='
			},
			controller: function($scope) {

				$scope.src = new MySrc({ defaultUrl: URLS.itemImg });
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					scope.$watch(function() {
						if (scope.report) { return scope.report.avatar; } else { return false; }

					}, function(avatar) {

						if (scope.report) {

							if (!scope.noLink()) { scope.src.href = '/#/report?id=' + scope.report._id; }

							var url = reportAvatarService.constructPhotoUrl(scope, true);
							if (!scope.hideDefaultSrc || url != scope.src.defaultUrl) { scope.src.load(url); }
						}
					});
				};
			}
		};

		return reportAvatar;
	});

})();