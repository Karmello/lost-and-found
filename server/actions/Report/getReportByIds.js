var r = require(global.paths._requires);

module.exports = function(req, res, next) {

	var getPromise = function(user, i) {

		return new r.Promise(function(resolve) {

			r.Report.findOne({ _id: user.reportsRecentlyViewed[i] }, function(err, report) {

				if (!err && report) {
					reports.push(report);

				} else {
					user.reportsRecentlyViewed.splice(i, 1);
				}

				resolve();
			});
		});
	};



	var action = new r.prototypes.Action(arguments);
	var reports = [];

	new r.Promise(function(resolve, reject) {

		r.User.findOne({ _id: req.decoded._id }, function(err, user) {

			if (!err && user) {

				var promises = [];
				var initialIdsCount = user.reportsRecentlyViewed.length;

				for (var i = initialIdsCount - 1; i >= 0 ; i--) {
					promises.push(getPromise(user, i));
				}

				r.Promise.all(promises).then(function() {

					if (user.reportsRecentlyViewed.length < initialIdsCount) {
						user.save({ validateBeforeSave: false });
					}

					resolve({
						meta: { count: reports.length },
						collection: reports
					});
				});

			} else { reject(err); }
		});

	}).then(function(data) {

		action.end(200, data);

	}, function(err) {

		action.end(400, err);
	});
};