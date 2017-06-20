(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('myComments', function($rootScope, $timeout, $moment, myCommentsService, CommentsRest, myClass) {

		var myComments = {
			restrict: 'E',
			templateUrl: 'public/templates/myComments.html',
			scope: {
				nestingLevel: '<',
				apiObj: '=',
				out: '='
			},
			controller: function($scope) {

				$scope.apiData = $rootScope.apiData;
				$scope.hardData = $rootScope.hardData;
				$scope.$moment = $moment;

				$scope.toggleReplies = myCommentsService.toggleReplies;
				$scope.makeLikeReq = myCommentsService.makeLikeReq;

				$scope.myForm = new myClass.MyForm({
					ctrlId: $scope.nestingLevel === 0 ? 'commentsForm' : 'commentsReplyForm',
					model: new myClass.MyDataModel({ userId: {}, content: {} }),
					submitAction: function(args) {

						this.model.set({ 'userId': $rootScope.apiData.loggedInUser._id });
						return CommentsRest.post(this.model.getValues(), myCommentsService.getIdParam($scope));
					},
					submitSuccessCb: function(res) {

						$timeout(function() {
							$scope.myForm.model.reset(true, true);
							myCommentsService.init($scope);
						});
					}
				});

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
							onClick: function() {

								this.parent.data.remove(myCommentsService.getIdParam($scope)).then(function() {
									myCommentsService.init($scope, true);

								}, function() {
									myCommentsService.init($scope, true);
								});
							}
						}
					]
				};
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					switch (scope.nestingLevel) {

						case 0:

							scope.$watch(function() { return scope.apiObj; }, function(newApiObj) {

								if (newApiObj) {
									myCommentsService.init(scope, true);
									scope.out.topCollectionBrowser = scope.collectionBrowser;
								}
							});

							break;

						case 1:

							myCommentsService.init(scope);
							break;
					}
				};
			}
		};

		return myComments;
	});

})();