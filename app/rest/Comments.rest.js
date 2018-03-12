var CommentsRest = function(Restangular) {

  var comments = Restangular.service('comments');
  return comments;
};

CommentsRest.$inject = ['Restangular'];
angular.module('appModule').factory('CommentsRest', CommentsRest);