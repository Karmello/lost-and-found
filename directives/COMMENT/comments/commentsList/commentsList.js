(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('commentsList', function($rootScope, $timeout, $moment, commentsConf, CommentsRest, myClass) {

		var commentsList = {
			restrict: 'E',
			templateUrl: 'public/directives/COMMENT/comments/commentsList/commentsList.html',
			scope: {
				collectionBrowser: '=',
				nestingLevel: '<'
			},
			controller: function($scope) {

				$scope.apiData = $rootScope.apiData;
				$scope.hardData = $rootScope.hardData;
				$scope.$moment = $moment;

				$scope.commentContextMenuConf = commentsConf.commentContextMenuConf;

				$scope.commentReplyForm = new myClass.MyForm({
					ctrlId: 'commentReplyForm',
					model: CommentsRest.commentReplyModel,
					submitAction: function(args) {

						$scope.commentReplyForm.model.set({ 'userId': $rootScope.apiData.loggedInUser._id });

						return CommentsRest.post($scope.commentReplyForm.model.getValues(), {
							commentId: $scope.commentReplyForm.activeComment._id
						});
					},
					submitSuccessCb: function(res) {

						$scope.commentReplyForm.model.reset(true, true);
						//$rootScope.$broadcast('initReportComments');
					},
					onCancel: function() {

						$scope.commentReplyForm.activeComment.showReplies = false;
						$scope.commentReplyForm.activeComment = undefined;
					}
				});

				$scope.onViewRepliesClick = function() {

					var comment = this;

					// Showing replies
					if (!comment.showReplies) {

						// Clearing model
						$scope.commentReplyForm.model.reset(true, true);

						// Hiding comment reply section if shown
						if ($scope.commentReplyForm.activeComment) { $scope.commentReplyForm.activeComment.showReplies = false; }

						// Instantiating new collection browser
						$scope.nestedCollectionBrowser = new myClass.MyCollectionBrowser({
							ctrlId: 'nestedCollectionBrowser',
							singlePageSize: 10,
							fetchData: function(query) {

								query.commentId = comment._id;
								return CommentsRest.getList(query);
							}
						});

						// Setting before init method
						$scope.nestedCollectionBrowser.beforeInit = function() {
							delete CommentsRest.activeCollectionBrowser;
							CommentsRest.activeCollectionBrowser = $scope.nestedCollectionBrowser;
						};

						// Setting new comment as active and showing reply section
						$scope.commentReplyForm.activeComment = comment;
						$scope.commentReplyForm.activeComment.showReplies = true;

						$timeout(function() {
							$('html, body').animate({ scrollTop: $('#comment_' + comment._id).offset().top }, 'fast');
							$timeout(function() { $scope.nestedCollectionBrowser.init(); }, 250);
						});
					}
				};
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

				};
			}
		};

		return commentsList;
	});

})();