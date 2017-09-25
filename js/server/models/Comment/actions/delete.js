const cm = require(global.paths.server + '/cm');

module.exports = (...args) => {

  let action = new cm.prototypes.Action(args);

  // Deleting first level comment
  if (action.req.query.reportId) {

    // Getting comment
    cm.Comment.findOne({ _id: action.req.params.id }, (err, comment) => {

      // Got comment
      if (!err && comment) {
        comment.remove(() => { action.end(204); });

      } else { action.end(400, err); }
    });

  // Deleting nested comment
  } else if (action.req.query.parentId) {

    cm.Comment.findOneAndUpdate(
      { _id: action.req.query.parentId },
      { $pull: { comments: { _id: action.req.params.id } } },
      (err) => {
        if (!err) { action.end(204); } else { action.end(400, err); }
      }
    );

  } else { action.end(400, 'NO_REPORT_OR_PARENT_ID'); }
};