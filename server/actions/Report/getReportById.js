var r = require(global.paths._requires);

module.exports = function(req, res, next) {

	var action = new r.prototypes.Action(arguments);

	new r.Promise(function(resolve, reject) {

		r.Report.findOne({ _id: req.query._id }, function(err, report) {

			if (!err && report) {

				r.User.update({ _id: req.decoded._doc._id }, { $addToSet: { reportsRecentlyViewed: report._id } }, function(err, user) {

					if (!err) {

						r.User.findOne({ _id: req.decoded._doc._id }, function(err, user) {

							if (!err) {

								if (user.reportsRecentlyViewed.length > global.app.get('USER_RECENTLY_VIEWED_REPORTS_MAX_LENGTH')) {
									user.reportsRecentlyViewed.shift();
									user.save({ validateBeforeSave: false });
								}

								resolve({
									report: report,
									reportsRecentlyViewed: user.reportsRecentlyViewed
								});

							} else { reject(err); }
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
};