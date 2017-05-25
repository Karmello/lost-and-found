var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		var action = new r.prototypes.Action(arguments);

		var report = new r.Report(req.body);
		report.startEvent = new r.ReportEvent(req.body.startEvent);

		report.validate(function(err1) {
			report.startEvent.validate(function(err2) {

				if (!err1 && !err2) {

					report.save({ validateBeforeSave: false }, function(err) {

						if (!err) {
							r.modules.socketModule.emitReportsCount(report.startEvent.group);
							action.end(201, report);

						} else { action.end(400, err); }
					});

				} else {

					var err = { errors: {} };

					if (err1) {
						Object.assign(err.errors, err1.errors);
					}

					if (err2) {
						err.errors.startEvent = {};
						Object.assign(err.errors.startEvent, err2.errors);
					}

					action.end(400, err);
				}
			});
		});
	}
};