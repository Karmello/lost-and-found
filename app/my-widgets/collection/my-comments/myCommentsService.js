var myCommentsService = function($rootScope, $timeout, MyCollectionBrowser, CommentsRest, Restangular) {

  var service = this;

  service.init = function(scope, doNotScroll) {

    if (!scope.collectionBrowser) {

      scope.collectionBrowser = new MyCollectionBrowser({
        singlePageSize: 5,
        reverseOrder: true,
        fetchData: function(query) {

          return CommentsRest.getList(Object.assign(query, service.getIdParam(scope)));
        }
      });

      scope.collectionBrowser.beforeInit = function() {
        delete CommentsRest.activeCollectionBrowser;
        CommentsRest.activeCollectionBrowser = this;
        if (scope.nestingLevel === 0 && service.activeComment) { service.activeComment.showReplies = false; }
      };

      scope.collectionBrowser.refreshCb = function() {
        service.fixScrollPos(scope);
      };
    }

    scope.collectionBrowser.init(function() {
      if (!doNotScroll) { service.fixScrollPos(scope); }
    });
  };

  service.getIdParam = function(scope) {

    var query = {};

    if (scope.nestingLevel === 0) {
      query[scope.apiObj.route.substring(0, scope.apiObj.route.length - 1) + 'Id'] = scope.apiObj._id;

    } else {
      query.parentId = service.activeComment._id;
    }

    return query;
  };

  service.toggleReplies = function(scope, comment) {

    // Showing replies
    if (scope.nestingLevel === 0 && !comment.showReplies) {

      // Clearing model
      scope.myForm.model.reset(true, true);

      // Hiding comment reply section if shown
      if (service.activeComment) { service.activeComment.showReplies = false; }

      // Setting new comment as active and showing reply section
      service.activeComment = comment;
      service.activeComment.showReplies = true;

      // Hiding replies
    } else {

      comment.showReplies = false;
      $('html, body').animate({ scrollTop: $('#comment_' + service.activeComment._id).offset().top - 5 }, 'fast');
      service.activeComment = undefined;
    }
  };

  service.makeLikeReq = function(scope, comment) {

    comment.put(Object.assign(service.getIdParam(scope), { action: 'toggleLike' })).then(function(res) {
      comment.likes = res.data.likes;
    });
  };

  service.fixScrollPos = function(scope) {

    var delay = 500;

    if (scope.nestingLevel === 0) {

      $timeout(function() {
        $('html, body').animate({ scrollTop: $('#commentsSection').offset().top - 5 }, 'fast');
      }, delay);

    } else {

      $timeout(function() {
        $('html, body').animate({ scrollTop: $('#comment_' + service.activeComment._id).offset().top - 5 }, 'fast');
      }, delay);
    }
  };

  return service;
};

myCommentsService.$inject = ['$rootScope', '$timeout', 'MyCollectionBrowser', 'CommentsRest', 'Restangular'];
angular.module('appModule').service('myCommentsService', myCommentsService);