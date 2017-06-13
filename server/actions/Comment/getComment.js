var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		var action = new r.prototypes.Action(arguments);

		new r.Promise(function(resolve, reject) {

			if (req.query.reportId) {

				r.Report.findOne({ _id: req.query.reportId }, function(err, report) {

					if (!err && report) {

						r.Comment.find({ _id: { '$in': report.comments } }, '-comments')
						.skip(Number(req.query.skip))
						.limit(global.app.get('COMMENTS_MAX_GET'))
						.sort('-dateAdded')
						.exec(function(err, comments) {

							if (!err && comments) {

								resolve({
									meta: { count: report.comments.length },
									collection: comments
								});

							} else { reject(err); }
						});

					} else { reject(err); }
				});

			} else if (req.query.commentId) {

				r.Comment.findOne({ _id: req.query.commentId }, function(err, comment) {

					if (!err && comment) {

						resolve({
							meta: { count: comment.comments.length },
							collection: comment.comments
						});

					} else { reject(err); }
				});

			} else { reject('NO_REPORT_OR_COMMENT_ID'); }

		}).then(function(data) {

			var userPromises = [];
			for (var comment of data.collection) { userPromises.push(r.User.findOne({ _id: comment.userId })); }

			r.Promise.all(userPromises).then(function(users) {

				data.users = users;
				action.end(200, data);
			});

		}, function(err) {

			action.end(400, err);
		});
	}
};