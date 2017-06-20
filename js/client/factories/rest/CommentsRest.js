(function() {

	'use strict';

	var CommentsRest = function(Restangular, MyDataModel) {

		var comments = Restangular.service('comments');
		return comments;
	};

	CommentsRest.$inject = ['Restangular', 'MyDataModel'];
	angular.module('appModule').factory('CommentsRest', CommentsRest);

})();