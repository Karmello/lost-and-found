var r = require(global.paths.server + '/requires');

module.exports = {
	before: function(req, res, next) {

		var action = new r.prototypes.Action(arguments);

		new r.Promise(function(resolve, reject) {

			// Deleting first level comment
			if (req.query.reportId) {

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

										// Removing comment id from report comments array
										report.comments.splice(report.comments.indexOf(req.params.id), 1);

										// Saving updated report
										report.save(function(err) {

											if (!err) {

												// Removing comment and resolving
												comment.remove(function(err) { resolve(); });

											} else { reject(err); }
										});

									} else { reject('COMMENT_NOT_RELATED_TO_REPORT'); }

								} else { reject(err); }
							});

						} else { reject('DELETE_COMMENT_NOT_ALLOWED'); }

					} else { reject(err); }
				});

			// Deleting nested comment
			} else if (req.query.parentId) {

				r.Comment.findOneAndUpdate(
					{ _id: req.query.parentId },
					{ $pull: { comments: { _id: req.params.id } } },
					function(err, comment) {
						if (!err) { resolve(); } else { reject(err); }
					}
				);

			} else { reject('NO_REPORT_OR_PARENT_ID'); }

		}).then(function() {

			action.end(204);

		}, function(err) {

			action.end(400, err);
		});
	}
};