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

			report.startEvent = new r.ReportEvent(req.body.startEvent);

			r.actions.report.runValidation(report).then(function() {

				report.save({ validateBeforeSave: false }, function(err) {
					if (!err) { action.end(200, report); } else { action.end(400, err); }
				});

			}, function(err) {

				action.end(400, err);
			});
		});



		// When avatarFileName not found among photos filenames
		// if (!r._.find(req.body.photos, function(obj) { return obj.filename == req.body.avatarFileName; })) {

		// 	// When photos array empty
		// 	if (req.body.photos.length === 0) {
		// 		req.body.avatarFileName = '';

		// 	} else {

		// 		// Setting first available photo filename as avatarFileName
		// 		req.body.avatarFileName = req.body.photos[0].filename;
		// 	}
		// }
	}
};