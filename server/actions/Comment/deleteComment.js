var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		var action = new r.prototypes.Action(arguments);

		new r.Promise(function(resolve, reject) {

			if (!req.query.itemId) { reject(); }

			r.Comment.remove({ _id: req.params.id }, function(err) {

				if (!err) {

					r.Item.findOne({ _id: req.query.itemId }, function(err, item) {

						if (!err && item) {

							item.comments.splice(item.comments.indexOf(req.params.id), 1);

							item.save(function(err) {
								if (!err) { resolve(); } else { reject(err); }
							});

						} else { reject(err); }
					});

				} else { reject(err); }
			});

		}).then(function() {
			action.end(204);

		}, function(err) {
			action.end(400, err);
		});
	}
};