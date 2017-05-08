var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		var action = new r.prototypes.Action(arguments);

		// When avatarFileName not found among photos filenames
		if (!r._.find(req.body.photos, function(obj) { return obj.filename == req.body.avatarFileName; })) {

			// When photos array empty
			if (req.body.photos.length === 0) {
				req.body.avatarFileName = '';

			} else {

				// Setting first available photo filename as avatarFileName
				req.body.avatarFileName = req.body.photos[0].filename;
			}
		}

		// Creating new item
		var item = new r.Item(req.body);

		// Validating new item
		item.validate(function(err) {
			if (!err) { next(); } else { action.end(400, err); }
		});
	},
	after: function(req, res, next) {

		var action = new r.prototypes.Action(arguments);

		// Getting updated item to send back to the client
		r.Item.findOne({ _id: req.params.id }, function(err, item) {
			if (!err && item) { action.end(200, item); } else { action.end(400, err); }
		});
	}
};