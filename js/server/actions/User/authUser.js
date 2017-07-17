var r = require(global.paths.server + '/requires');

module.exports = function(req, res, next) {

	var action = new r.prototypes.Action(arguments);
	action.id = req.query.action;

	r.modules.authorize.userToken(req, res, function() {

		new r.Promise(function(resolve, reject) {

			r.User.findOne({ _id: req.decoded._id }, function(err, user) {

				if (!err && user) {

					req.session.theme = user.config.theme;
					req.session.language = user.config.language;

					resolve({ user: user });

				} else { reject(err); }
			});

		}).then(function(data) {

			action.end(200, data);

		}, function(err) {

			action.end(400, err);
		});
	});
};