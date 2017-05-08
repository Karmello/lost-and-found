(function() {

	'use strict';

	var CommentsRest = function(Restangular) {
		return Restangular.service('comments');
	};

	CommentsRest.$inject = ['Restangular'];
	angular.module('appModule').factory('CommentsRest', CommentsRest);

})();