const cm = require(global.paths.server + '/cm');

module.exports = (...args) => {

	let action = new cm.prototypes.Action(args);
	let newComment;

	if (action.req.query.reportId) {

		// Creating new comment instance
		newComment = new cm.Comment(action.req.body);
		newComment.parentId = action.req.query.reportId;

		// Saving comment
		newComment.save((err) => {
			if (!err) { action.end(200); } else { action.end(400, err); }
		});

	} else if (action.req.query.parentId) {

		cm.Comment.findOne({ _id: action.req.query.parentId }, (err, comment) => {

			if (!err && comment) {

				// Creating new subcomment
				newComment = new cm.Comment(action.req.body);
				newComment.parentId = comment._id;
				newComment.comments = null;

				newComment.validate((err) => {

					if (!err) {

						// Pushing new subcomment to comments array
						comment.comments.unshift(newComment);

						// Saving updated comment
						comment.save({ validateBeforeSave: false }, (err) => {
							if (!err) { action.end(200); } else { action.end(400, err); }
						});

					} else { action.end(400, err); }
				});

			} else { action.end(400, err); }
		});

	} else { action.end(400, 'NO_REPORT_OR_COMMENT_ID'); }
};