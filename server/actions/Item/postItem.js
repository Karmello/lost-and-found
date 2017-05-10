var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		var action = new r.prototypes.Action(arguments);
		var item = new r.Item(req.body);

		item.validate(function(err) {
			if (!err) { next(); } else { action.end(400, err); }
		});
	}
};