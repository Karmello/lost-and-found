var r = require(global.paths.server + '/requires');

module.exports = {
	before: function(req, res, next) {

		var action = new r.prototypes.Action(arguments);

		new r.Promise(function(resolve, reject) {

			r.Report.findOne({ _id: req.params.id }, function(err, report) {

				if (!err && report) {
					if (report.userId == req.decoded._id) {

						report.remove(function(err) {
							if (!err) { resolve(); } else { reject(err); }
						});

					} else { reject('REPORT_DELETE_NOT_ALLOWED'); }

				} else { reject(err); }
			});

		}).then(function() {

			action.end(204);

		}, function(err) {

			action.end(400, err);
		});
	}
};