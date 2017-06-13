(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('comments', function($rootScope, commentsConf, MyForm, CommentsRest) {

		var comments = {
			restrict: 'E',
			templateUrl: 'public/directives/COMMENT/comments/comments.html',
			scope: {
				ctrlId: '@',
				report: '='
			},
			controller: function($scope) {

				$scope.commentForm = new MyForm({
					ctrlId: 'commentForm',
					model: CommentsRest.commentModel,
					submitAction: function(args) {

						$scope.commentForm.model.set({ 'userId': $rootScope.apiData.loggedInUser._id });
						return CommentsRest.post($scope.commentForm.model.getValues(), { reportId: $rootScope.apiData.report._id });
					},
					submitSuccessCb: function(res) {

						$scope.commentForm.model.reset(true, true);
						$rootScope.$broadcast('initReportComments');
					}
				});

				$scope.init = function() {

					$scope.collectionBrowser = commentsConf.reportCommentsBrowser;

					$scope.collectionBrowser.beforeInit = function() {
						delete CommentsRest.activeCollectionBrowser;
						CommentsRest.activeCollectionBrowser = $scope.collectionBrowser;
					};

					$scope.collectionBrowser.init();
				};
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

					scope.$watch(function() { return scope.report; }, function(newReport, oldReport) {
						if (newReport) { scope.init(); }
					});
				};
			}
		};

		return comments;
	});

})();