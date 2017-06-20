var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		var action = new r.prototypes.Action(arguments);

		new r.Promise(function(resolve, reject) {

			if (req.query.reportId) {

				r.Report.findOne({ _id: req.query.reportId }, function(err, report) {

					if (!err && report) {
						r.User.findOne({ _id: report.userId }, function(err, user) {
							if (!err && user) { resolve([user]); } else { reject(err); }
						});

					} else { reject(err); }
				});

			} else { next(); }

		}).then(function(data) {
			action.end(200, data);

		}, function(err) {
			action.end(400, err);
		});
	}
};