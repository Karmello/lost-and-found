(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('myCommentsList', function($rootScope, $timeout, $moment, commentsConf, CommentsRest, myClass) {

		var myCommentsList = {
			restrict: 'E',
			templateUrl: 'public/directives/my/collection/myComments/myCommentsList/myCommentsList.html',
			scope: {
				nestingLevel: '<',
				collectionBrowser: '=',
				conf: '='
			},
			controller: function($scope) {

				$scope.apiData = $rootScope.apiData;
				$scope.hardData = $rootScope.hardData;
				$scope.$moment = $moment;

				$scope.commentContextMenuConf = {
					icon: 'glyphicon glyphicon-option-horizontal',
					switchers: [
						{
							_id: 'edit',
							label: $scope.hardData.imperatives[33],
							onClick: function() {}
						},
						{
							_id: 'delete',
							label: $scope.hardData.imperatives[14],
							onClick: function() { $scope.conf.onDelete.call(this); }
						}
					]
				};

				$scope.commentReplyForm = new myClass.MyForm({
					ctrlId: 'commentsReplyForm',
					model: new myClass.MyDataModel({ userId: {}, content: {} }),
					submitAction: function(args) {

						return $scope.conf.replySubmitAction.call(this);
					},
					submitSuccessCb: function(res) {

						this.model.reset(true, true);
					},
					onCancel: function() {

						$scope.conf.activeComment.showReplies = false;
						$scope.conf.activeComment = undefined;
					}
				});

				$scope.onViewRepliesClick = function() {

					var comment = this;

					// Showing replies
					if (!comment.showReplies) {

						// Clearing model
						$scope.commentReplyForm.model.reset(true, true);

						// Hiding comment reply section if shown
						if ($scope.conf.activeComment) { $scope.conf.activeComment.showReplies = false; }

						// Instantiating new collection browser
						$scope.nestedCollectionBrowser = new myClass.MyCollectionBrowser({
							singlePageSize: 10,
							fetchData: function(query) {

								query.commentId = comment._id;
								return CommentsRest.getList(query);
							}
						});

						// Setting before init method
						$scope.nestedCollectionBrowser.beforeInit = function() {
							delete commentsConf.activeCollectionBrowser;
							commentsConf.activeCollectionBrowser = this;
						};

						// Setting new comment as active and showing reply section
						$scope.conf.activeComment = comment;
						$scope.conf.activeComment.showReplies = true;

						$timeout(function() {
							$('html, body').animate({ scrollTop: $('#comment_' + comment._id).offset().top }, 'fast');
							$timeout(function() { $scope.nestedCollectionBrowser.init(); }, 250);
						});
					}
				};
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {};
			}
		};

		return myCommentsList;
	});

})();