const cm = require(global.paths.server + '/cm');

module.exports = (...args) => {

  let action = new cm.prototypes.Action(args);

  // Getting zero level comment
  cm.Comment.findOne({ _id: action.req.query.parentId || action.req.params.id }, (err, comment) => {

    if (!err && comment) {

      let commentToBeEdited;

      // Setting comment to be edited
      if (action.req.query.parentId) {
        commentToBeEdited = comment.comments.id(action.req.params.id);

      } else {
        commentToBeEdited = comment;
      }

      switch (action.req.query.action) {

        case 'toggleLike': {

          let index = commentToBeEdited.likes.indexOf(action.req.decoded._id);

          if (index == -1) {
            commentToBeEdited.likes.push(action.req.decoded._id);

          } else {
            commentToBeEdited.likes.splice(index, 1);
          }

          break;
        }

        default: {
          return action.end(400, 'NO_PUT_COMMENT_ACTION_NAME');
        }
      }

      comment.save({ validateBeforeSave: false }, (err) => {
        if (!err) { action.end(200, commentToBeEdited); } else { action.end(400, err); }
      });

    } else { action.end(400, err); }
  });
};