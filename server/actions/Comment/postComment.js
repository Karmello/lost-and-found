var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		var action = new r.prototypes.Action(arguments);

		new r.Promise(function(resolve, reject) {

			if (!req.query.reportId) { reject(); }

			new r.Comment(req.body).save(function(err, comment) {

				if (!err) {

					r.Report.findOne({ _id: req.query.reportId }, function(err, report) {

						if (!err) {

							report.comments.push(comment._id);
							report.save();
							resolve();

						} else { reject(err); }
					});

				} else { reject(err); }
			});

		}).then(function(data) {
			action.end(200);

		}, function(err) {
			action.end(400, err);
		});
	}
};