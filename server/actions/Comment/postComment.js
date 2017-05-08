var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		var action = new r.prototypes.Action(arguments);

		new r.Promise(function(resolve, reject) {

			if (!req.query.itemId) { reject(); }

			new r.Comment(req.body).save(function(err, comment) {

				if (!err) {

					r.Item.findOne({ _id: req.query.itemId }, function(err, item) {

						if (!err) {

							item.comments.push(comment._id);
							item.save();
							resolve();

						} else { reject(err); }
					});

				} else { reject(err); }
			});

		}).then(function(data) {
			action.end(200);

		}, function(err) {
			action.end(400, err);
		});
	}
};