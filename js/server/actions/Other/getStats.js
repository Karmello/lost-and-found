var r = require(global.paths.server + '/requires');

module.exports = function(req, res, next) {

	var action = new r.prototypes.Action(arguments);
	var data = {};

	new r.Promise(function(resolve) {

		// Getting users count
		r.User.count({}, function(err, count) {

			if (!err) {

				data.usersCount = count;

				// Getting reports count
				r.Report.count({}, function(err, count) {

					if (!err) {

						data.reportsCount = count;

						// Getting lost reports count
						r.Report.count({ 'startEvent.type': 'lost' }, function(err, count) {

							if (!err) {

								data.lostReportsCount = count;

								// Getting found reports count
								r.Report.count({ 'startEvent.type': 'found' }, function(err, count) {

									if (!err) {

										data.foundReportsCount = count;
										resolve();

									} else { resolve(err); }
								});

							} else { resolve(err); }
						});

					} else { resolve(err); }
				});

			} else { resolve(err); }
		});

	}).then(function(err) {

		if (!err) { action.end(200, data); } else { action.end(500, err); }
	});
};