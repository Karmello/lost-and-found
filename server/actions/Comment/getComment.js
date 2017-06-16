var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		var action = new r.prototypes.Action(arguments);

		new r.Promise(function(resolve, reject) {

			if (req.query.reportId) {

				r.Report.findOne({ _id: req.query.reportId }, function(err, report) {

					if (!err && report) {

						r.Comment.aggregate([
							{ $match: { _id: { $in: report.comments } } },
							{ $sort: { dateAdded: -1 } },
							{ $skip: Number(req.query.skip) || 0 },
							{ $limit: global.app.get('COMMENTS_MAX_GET') },
							{
								$project: {
									parentId: '$parentId',
									userId: '$userId',
									content: '$content',
									dateAdded: '$dateAdded',
									commentsCount: { $size: '$comments' }
								}
							}

						], function(err, comments) {

							if (!err && comments) {

								resolve({
									meta: { count: report.comments.length },
									collection: comments
								});

							} else { reject(err); }
						});

					} else { reject(err); }
				});

			} else if (req.query.parentId) {

				r.Comment.findOne({ _id: req.query.parentId }, function(err, comment) {

					if (!err && comment) {

						r.Comment.aggregate([
							{ $match: { _id: comment._id } },
							{ $unwind: '$comments' },
							{ $sort: { 'comments.dateAdded': -1 } },
							{ $skip: Number(req.query.skip) || 0 },
							{ $limit: global.app.get('COMMENTS_MAX_GET') }

						], function(err, comments) {

							if (!err && comments) {

								resolve({
									meta: { count: comment.comments.length },
									collection: comments
								});

							} else { reject(err); }
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