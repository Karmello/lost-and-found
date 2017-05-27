var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		var action = new r.prototypes.Action(arguments);

		new r.Promise(function(resolve, reject) {

			r.User.findOne({ _id: req.params.id }, function(err, user) {

				if (!err && user) {

					r.DeactivationReason.findOne({ _id: req.query.deactivationReasonId }, function(err, deactivationReason) {

						if (!err && deactivationReason) {

							user.remove(function(err) {

								if (!err) {

									deactivationReason.count += 1;
									deactivationReason.save();

									resolve();

								} else { action.end(500, err); }
							});

						} else { reject(err); }
					});

				} else { reject(err); }
			});

		}).then(function(data) {

			action.end(204, data);

		}, function(err) {

			action.end(400, err);
		});
	}
};