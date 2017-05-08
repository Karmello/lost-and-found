(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('comments', function($rootScope, commentsConf, myClass, CommentsRest) {

		var comments = {
			restrict: 'E',
			templateUrl: 'public/directives/COMMENT/comments/comments.html',
			scope: {
				ctrlId: '@'
			},
			controller: function($scope) {

				$scope.apiData = $rootScope.apiData;
				$scope.hardData = $rootScope.hardData;

				$scope.myForm = new myClass.MyForm({
					ctrlId: 'commentForm',
					model: new myClass.MyFormModel('commentModel', ['userId', 'content'], false),
					submitAction: function(args) {

						var userId = $rootScope.globalFormModels.personalDetailsModel.getValue('_id');
						$scope.myForm.model.setValue('userId', userId);
						return CommentsRest.post($scope.myForm.model.getValues(), { itemId: $rootScope.apiData.item._id });
					},
					submitSuccessCb: function(res) {

						$scope.myForm.model.clear();
						$rootScope.$broadcast('initItemComments');
					}
				});

				$scope.init = function() {

					$scope.collectionBrowser = commentsConf.itemCommentsBrowser;
					$scope.commentContextMenuConf = commentsConf.commentContextMenuConf;

					$scope.collectionBrowser.init();
				};

				if (!$scope.collectionBrowser) { $scope.init(); }
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