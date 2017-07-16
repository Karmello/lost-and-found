var r = require(global.paths.server + '/requires');

module.exports = {
	before: function(req, res, next) {

		var action = new r.prototypes.Action(arguments);

		new r.Promise(function(resolve, reject) {

			// Deleting first level comment
			if (req.query.reportId) {

				// Getting comment
				r.Comment.findOne({ _id: req.params.id }, function(err, comment) {

					// Got comment
					if (!err && comment) {
						comment.remove(function(err) { resolve(); });

					} else { reject(err); }
				});

			// Deleting nested comment
			} else if (req.query.parentId) {

				r.Comment.findOneAndUpdate(
					{ _id: req.query.parentId },
					{ $pull: { comments: { _id: req.params.id } } },
					function(err, comment) {
						if (!err) { resolve(); } else { reject(err); }
					}
				);

			} else { reject('NO_REPORT_OR_PARENT_ID'); }

		}).then(function() {

			action.end(204);

		}, function(err) {

			action.end(400, err);
		});
	}
};