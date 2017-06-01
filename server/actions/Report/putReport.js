var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		var action = new r.prototypes.Action(arguments);

		r.Report.findOne({ _id: req.params.id }, function(err, report) {

			if (err) { return action.end(400, err); }

			report.category1 = req.body.category1;
			report.category2 = req.body.category2;
			report.category3 = req.body.category3;

			report.title = req.body.title;
			report.description = req.body.description;
			report.serialNo = req.body.serialNo;

			report.avatar = req.body.avatar;
			report.photos = req.body.photos;

			if (!report.avatar && report.photos.length > 0) {
				report.avatar = report.photos[0].filename;
			}

			report.startEvent = new r.ReportEvent(req.body.startEvent);



			r.actions.report.runValidation(report).then(function() {

				report.save({ validateBeforeSave: false }, function(err) {
					if (!err) { action.end(200, report); } else { action.end(400, err); }
				});

			}, function(err) {

				action.end(400, err);
			});
		});
	}
};