(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('myComments', function($rootScope, commentsConf, myClass) {

		var myComments = {
			restrict: 'E',
			templateUrl: 'public/directives/my/collection/myComments/myComments.html',
			scope: {
				conf: '='
			},
			controller: function($scope) {

				$scope.conf.collectionBrowser.beforeInit = function() {
					delete commentsConf.activeCollectionBrowser;
					commentsConf.activeCollectionBrowser = this;
				};

				$scope.commentForm = new myClass.MyForm({
					ctrlId: 'commentsForm',
					model: new myClass.MyDataModel({ userId: {}, content: {} }),
					submitAction: function(args) {

						return $scope.conf.submitAction.call(this);
					},
					submitSuccessCb: function(res) {

						this.model.reset(true, true);
						$rootScope.$broadcast($scope.conf.ctrlId + 'Init');
					}
				});
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					if (!$rootScope.$$listeners[scope.conf.ctrlId + 'Init']) {
						$rootScope.$on(scope.conf.ctrlId + 'Init', function(e, args) {
							scope.conf.collectionBrowser.init();
						});
					}

					scope.$on('$destroy', function() {
						$rootScope.$$listeners[scope.conf.ctrlId + 'Init'] = null;
					});

					scope.$watch(scope.conf.apiObjWatch, function(newApiObj) {
						if (newApiObj) { scope.conf.collectionBrowser.init(); }
					});
				};
			}
		};

		return myComments;
	});

})();