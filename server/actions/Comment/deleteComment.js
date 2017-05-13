var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		var action = new r.prototypes.Action(arguments);

		new r.Promise(function(resolve, reject) {

			if (!req.query.reportId) { reject(); }

			r.Comment.remove({ _id: req.params.id }, function(err) {

				if (!err) {

					r.Report.findOne({ _id: req.query.reportId }, function(err, report) {

						if (!err && report) {

							report.comments.splice(report.comments.indexOf(req.params.id), 1);

							report.save(function(err) {
								if (!err) { resolve(); } else { reject(err); }
							});

						} else { reject(err); }
					});

				} else { reject(err); }
			});

		}).then(function() {
			action.end(204);

		}, function(err) {
			action.end(400, err);
		});
	}
};