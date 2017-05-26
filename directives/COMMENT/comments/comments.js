(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('comments', function($rootScope, $moment, commentsConf, myClass, CommentsRest, UsersRest) {

		var comments = {
			restrict: 'E',
			templateUrl: 'public/directives/COMMENT/comments/comments.html',
			scope: {
				ctrlId: '@'
			},
			controller: function($scope) {

				$scope.apiData = $rootScope.apiData;
				$scope.hardData = $rootScope.hardData;
				$scope.$moment = $moment;

				$scope.myForm = new myClass.MyForm({
					ctrlId: 'commentForm',
					model: CommentsRest.commentModel,
					submitAction: function(args) {

						var userId = UsersRest.personalDetailsModel.getValue('_id');
						$scope.myForm.model.set({ 'userId': userId });
						return CommentsRest.post($scope.myForm.model.getValues(), { reportId: $rootScope.apiData.report._id });
					},
					submitSuccessCb: function(res) {

						$scope.myForm.model.clear();
						$rootScope.$broadcast('initReportComments');
					}
				});

				$scope.init = function() {

					$scope.collectionBrowser = commentsConf.reportCommentsBrowser;
					$scope.commentContextMenuConf = commentsConf.commentContextMenuConf;

					$scope.collectionBrowser.init();
				};

				if (!$scope.collectionBrowser && $rootScope.apiData.report) { $scope.init(); }
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					if (!$rootScope.$$listeners['init' + scope.ctrlId]) {
						$rootScope.$on('init' + scope.ctrlId, function(e, args) {
							scope.init();
						});
					}

					scope.$on('$destroy', function() {
						$rootScope.$$listeners['init' + scope.ctrlId] = null;
					});
				};
			}
		};

		return comments;
	});

})();