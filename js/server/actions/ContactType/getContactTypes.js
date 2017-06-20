var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		r.ContactType.aggregate([
			{
				$project: {
					'index': 1,
					'label': '$label.' + req.session.language
				}
			}

		], function(err, contactTypes) {

			if (!err && contactTypes) {
				res.status(200).send(contactTypes);

			} else { res.status(500).send(); }
		});
	}
};