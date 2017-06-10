(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('reportAvatar', function(reportAvatarService, MySrc) {

		var reportAvatar = {
			restrict: 'E',
			templateUrl: 'public/directives/REPORT/reportAvatar/reportAvatar.html',
			scope: {
				report: '=',
				noLink: '&',
				hideDefaultSrc: '='
			},
			controller: function($scope) {

				$scope.src = new MySrc({ defaultUrl: 'public/imgs/item.png' });
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					scope.$watch(function() { return scope.report; }, function(report) {

						if (report) {

							if (!scope.noLink()) { scope.src.href = '/#/report?id=' + report._id; }

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