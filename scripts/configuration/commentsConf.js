(function() {

	'use strict';

	var commentsConf = function($rootScope, hardDataService, CommentsRest, myClass) {

		var hardData = hardDataService.get();

		var service = this;

		service.reportCommentsConf = {
			ctrlId: 'reportComments',
			collectionBrowser: new myClass.MyCollectionBrowser({
				ctrlId: 'reportCommentsBrowser',
				singlePageSize: 10,
				fetchData: function(query) {

					if ($rootScope.apiData.report) {
						query.reportId = $rootScope.apiData.report._id;
						return CommentsRest.getList(query);
					}
				}
			}),
			apiObjWatch: function() { return $rootScope.apiData.report; },
			submitAction: function() {

				this.model.set({ 'userId': $rootScope.apiData.loggedInUser._id });
				return CommentsRest.post(this.model.getValues(), { reportId: $rootScope.apiData.report._id });
			},
			replySubmitAction: function() {

				this.model.set({ 'userId': $rootScope.apiData.loggedInUser._id });
				return CommentsRest.post(this.model.getValues(), { commentId: service.reportCommentsConf.activeComment._id });
			},
			onDelete: function() {

				this.parent.data.remove({ reportId: $rootScope.apiData.report._id }).then(function() {
					$rootScope.$broadcast('reportCommentsInit');
				});
			}
		};

		return service;
	};

	commentsConf.$inject = ['$rootScope', 'hardDataService', 'CommentsRest', 'myClass'];
	angular.module('appModule').service('commentsConf', commentsConf);

})();