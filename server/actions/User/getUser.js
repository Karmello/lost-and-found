var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		// By reportId
		if (req.query.reportId) {

			r.Report.findOne({ _id: req.query.reportId }, function(err, report) {

				if (!err && report) {
					r.User.findOne({ _id: report.userId }, function(err, user) {

						if (!err && user) {
							res.status(200).send([user]);

						} else { res.status(400).send(err); }
					});

				} else { res.status(400).send(err); }
			});

		} else {

			r.User.findOne({ _id: req.query._id }, function(err, user) {

				if (!err && user) {
					res.status(200).send([user]);

				} else { res.status(400).send(err); }
			});
		}
	}
};