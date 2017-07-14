var r = require(global.paths.server + '/requires');

module.exports = {
	before: function(req, res, next) {

		var action = new r.prototypes.Action(arguments);

		new r.Promise(function(resolve, reject) {

			// Getting zero level comment
			r.Comment.findOne({ _id: req.query.parentId || req.params.id }, function(err, comment) {

				if (!err && comment) {

					var commentToBeEdited;

					// Setting comment to be edited
					if (req.query.parentId) {
						commentToBeEdited = comment.comments.id(req.params.id);

					} else {
						commentToBeEdited = comment;
					}

					switch (req.query.action) {

						case 'toggleLike':

							var index = commentToBeEdited.likes.indexOf(req.decoded._id);

							if (index == -1) {
								commentToBeEdited.likes.push(req.decoded._id);

							} else {
								commentToBeEdited.likes.splice(index, 1);
							}

							break;

						default:
							return reject('NO_PUT_COMMENT_ACTION_NAME');
					}

					comment.save({ validateBeforeSave: false }, function(err) {
						if (!err) { resolve(commentToBeEdited); } else { reject(err); }
					});

				} else { reject(err); }
			});

		}).then(function(data) {

			action.end(200, data);

		}, function(err) {

			action.end(400, err);
		});
	}
};