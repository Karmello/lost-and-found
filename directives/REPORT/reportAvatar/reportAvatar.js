(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('reportAvatar', function(reportAvatarService, reportAvatarConf, MySrc) {

		var reportAvatar = {
			restrict: 'E',
			templateUrl: 'public/directives/REPORT/reportAvatar/reportAvatar.html',
			scope: {
				report: '=',
				noLink: '&'
			},
			controller: function($scope) {

				$scope.src = new MySrc({ defaultUrl: reportAvatarConf.defaultUrl });
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					scope.$watch(function() { return scope.report; }, function(report) {

						if (report) {

							if (!scope.noLink()) { scope.src.href = '/#/report/photos?id=' + report._id; }
							scope.src.load(reportAvatarService.constructPhotoUrl(scope, true));
						}
					});
				};
			}
		};

		return reportAvatar;
	});

})();