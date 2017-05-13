var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		var action = new r.prototypes.Action(arguments);

		new r.Promise(function(resolve, reject) {

			r.Report.findOne({ _id: req.query.reportId }, function(err, report) {

				if (!err && report) {

					r.Comment.find({ _id: { '$in': report.comments } })
					.skip(Number(action.req.query.skip))
					.limit(global.app.get('COMMENTS_MAX_GET'))
					.sort('-dateAdded')
					.exec(function(err, comments) {

						if (!err && comments) {

							var userPromises = [];
							for (var comment of comments) { userPromises.push(r.User.findOne({ _id: comment.userId })); }

							r.Promise.all(userPromises).then(function(users) {

								resolve({
									meta: { count: report.comments.length },
									collection: comments,
									users: users
								});
							});

						} else { reject(err); }
					});

				} else { reject(err); }
			});

		}).then(function(data) {
			action.end(200, data);

		}, function(err) {
			action.end(400, err);
		});
	}
};