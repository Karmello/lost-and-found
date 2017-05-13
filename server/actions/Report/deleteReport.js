var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		r.Report.findOne({ _id: req.params.id }, function(err, report) {

			if (!err && report) {

				report.remove(function(err) {
					if (!err) { res.status(204).send(); } else { res.status(400).send(err); }
				});

			} else { res.status(400).send(err); }
		});
	}
};