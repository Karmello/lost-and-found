(function() {

	'use strict';

	var commentsConf = function($rootScope, hardDataService, CommentsRest, myClass) {

		var hardData = hardDataService.get();

		this.commentContextMenuConf = {
			icon: 'glyphicon glyphicon-option-horizontal',
			switchers: [
				{
					_id: 'edit',
					label: hardData.imperatives[33],
					onClick: function() {

					}
				},
				{
					_id: 'delete',
					label: hardData.imperatives[14],
					onClick: function() {

						this.parent.data.remove({ reportId: $rootScope.apiData.report._id }).then(function() {
							$rootScope.$broadcast('initReportComments');
						});
					}
				}
			]
		};

		this.reportCommentsBrowser = new myClass.MyCollectionBrowser({
			singlePageSize: 10,
			fetchData: function(query) {

				if ($rootScope.apiData.report) {
					query.reportId = $rootScope.apiData.report._id;
					return CommentsRest.getList(query);
				}
			}
		});

		return this;
	};

	commentsConf.$inject = ['$rootScope', 'hardDataService', 'CommentsRest', 'myClass'];
	angular.module('appModule').service('commentsConf', commentsConf);

})();