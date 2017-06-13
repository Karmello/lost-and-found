var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		var action = new r.prototypes.Action(arguments);

		new r.Promise(function(resolve, reject) {

			if (!req.query.reportId) { reject('NO_REPORT_ID'); }

			// Getting comment
			r.Comment.findOne({ _id: req.params.id }, function(err, comment) {

				// Got comment
				if (!err && comment) {

					// Comment belongs to the requester
					if (comment.userId == req.decoded._id) {

						// Getting report
						r.Report.findOne({ _id: req.query.reportId }, function(err, report) {

							// Got report
							if (!err && report) {

								// Comment belongs to the report
								if (report.comments.indexOf(comment._id) > -1) {
									resolve({ comment: comment, report: report });

								} else {
									reject('COMMENT_NOT_RELATED_TO_REPORT');
								}

							} else { reject(err); }
						});

					} else { reject('DELETE_COMMENT_NOT_ALLOWED'); }

				} else { reject(err); }
			});

		}).then(function(args) {

			// Removing comment id from report comments array
			args.report.comments.splice(args.report.comments.indexOf(req.params.id), 1);

			// Saving updated report
			args.report.save(function(err) {

				if (!err) {

					// Removing comment
					args.comment.remove(function(err) { action.end(204); });

				} else { reject(err); }
			});

		}, function(err) {

			action.end(400, err);
		});
	}
};