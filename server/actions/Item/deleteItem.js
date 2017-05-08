var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		r.Item.findOne({ _id: req.params.id }, function(err, item) {

			if (!err && item) {

				item.remove(function(err) {
					if (!err) { res.status(204).send(); } else { res.status(400).send(err); }
				});

			} else { res.status(400).send(err); }
		});
	}
};