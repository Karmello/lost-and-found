var r = require(global.paths._requires);

module.exports = function(req, res, next) {

	var getPromise = function(i) {

		return new r.Promise(function(resolve) {

			r.Report.findOne({ _id: req.query.ids[i] }, function(err, report) {

				if (!err && report) {
					reports.push(report);

				} else {
					req.query.ids.splice(i, 1);
				}

				resolve();
			});
		});
	};



	var action = new r.prototypes.Action(arguments);
	var reports = [];

	new r.Promise(function(resolve, reject) {

		if (req.query.ids) {

			var promises = [];
			var initialIdsCount = req.query.ids.length;

			for (var i = req.query.ids.length - 1; i >= 0 ; i--) {
				promises.push(getPromise(i));
			}

			r.Promise.all(promises).then(function() {

				if (req.query.ids.length < initialIdsCount) {

					r.User.findOne({ _id: req.decoded._doc._id }, function(err, user) {

						if (!err && user) {
							user.reportsRecentlyViewed = req.query.ids;
							user.save({ validateBeforeSave: false });
						}
					});
				}

				resolve({
					meta: { count: reports.length },
					collection: reports
				});
			});

		} else {

			resolve({
				meta: { count: 0 },
				collection: []
			});
		}

	}).then(function(data) {

		action.end(200, data);

	}, function(err) {

		action.end(400, err);
	});
};