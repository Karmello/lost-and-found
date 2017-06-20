var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		r.DeactivationReason.aggregate([
			{
				$project: {
					'index': 1,
					'label': '$label.' + req.session.language
				}
			}

		], function(err, deactivationReasons) {

			if (!err && deactivationReasons) {
				res.status(200).send(deactivationReasons);

			} else { res.status(500).send(); }
		});
	}
};