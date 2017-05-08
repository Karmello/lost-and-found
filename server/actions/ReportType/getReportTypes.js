var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		r.ReportType.aggregate([
			{
				$project: {
					'index': 1,
					'label': '$label.' + req.session.language
				}
			}

		], function(err, reportTypes) {

			if (!err && reportTypes) {
				res.status(200).send(reportTypes);

			} else { res.status(500).send(); }
		});
	}
};