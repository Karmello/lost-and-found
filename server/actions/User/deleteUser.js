var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		new r.Promise(function(resolve) {

			r.User.findOne({ _id: req.params.id }, function(err, user) {
				if (!err && user) { resolve(user); } else { res.status(400).send(err); }
			});

		}).then(function(user) {

			new r.Promise(function(resolve) {

				r.DeactivationReason.findOne({ _id: req.query.deactivationReasonId }, function(err, deactivationReason) {
					if (!err && deactivationReason) { resolve(deactivationReason); } else { res.status(400).send(err); }
				});

			}).then(function(deactivationReason) {

				user.remove(function(err) {

					if (!err) {

						deactivationReason.count += 1;
						deactivationReason.save();

						res.status(204).send();

					} else { res.status(400).send(err); }
				});
			});
		});
	}
};