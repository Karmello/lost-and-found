(function() {

	'use strict';

	var commentsConf = function($rootScope, hardDataService, CommentsRest, myClass) {

		var hardData = hardDataService.get();

		this.commentContextMenuConf = {
			icon: 'glyphicon glyphicon-option-horizontal',
			switchers: [
				{
					_id: 'edit',
					label: hardData.phrases[68],
					onClick: function() {

					}
				},
				{
					_id: 'delete',
					label: hardData.phrases[14],
					onClick: function() {

						this.parent.data.remove({ itemId: $rootScope.apiData.item._id }).then(function() {
							$rootScope.$broadcast('initItemComments');
						});
					}
				}
			]
		};

		this.itemCommentsBrowser = new myClass.MyCollectionBrowser({
			singlePageSize: 10,
			fetchData: function(query) {

				if ($rootScope.apiData.item) {
					query.itemId = $rootScope.apiData.item._id;
					return CommentsRest.getList(query);
				}
			}
		});

		return this;
	};

	commentsConf.$inject = ['$rootScope', 'hardDataService', 'CommentsRest', 'myClass'];
	angular.module('appModule').service('commentsConf', commentsConf);

})();