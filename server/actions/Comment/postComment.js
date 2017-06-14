var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		var action = new r.prototypes.Action(arguments);
		var newComment;

		new r.Promise(function(resolve, reject) {

			if (req.query.reportId) {

				// Getting report
				r.Report.findOne({ _id: req.query.reportId }, function(err, report) {

					if (!err && report) {

						// Creating new comment instance
						newComment = new r.Comment(req.body);

						// Saving comment
						newComment.save(function(err) {

							if (!err) {

								// Updating report comments array
								report.comments.push(newComment._id);

								// Saving updated report
								report.save(function(err) {
									if (!err) { resolve(); } else { newComment.remove(); reject(err); }
								});

							} else { reject(err); }
						});

					} else { reject(err); }
				});

			} else if (req.query.parentId) {

				r.Comment.findOne({ _id: req.query.parentId }, function(err, comment) {

					if (!err && comment) {

						// Creating new subcomment
						newComment = new r.Comment(req.body);
						newComment.parentId = comment._id;
						newComment.comments = undefined;

						newComment.validate(function(err) {

							if (!err) {

								// Pushing new subcomment to comments array
								comment.comments.unshift(newComment);

								// Saving updated comment
								comment.save({ validateBeforeSave: false }, function(err) {
									if (!err) { resolve(); } else { reject(err); }
								});

							} else { reject(err); }
						});

					} else { reject(err); }
				});

			} else { reject('NO_REPORT_OR_COMMENT_ID'); }

		}).then(function() {

			action.end(200);

		}, function(err) {

			action.end(400, err);
		});
	}
};