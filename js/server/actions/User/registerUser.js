var r = require(global.paths.server + '/requires');

module.exports = function(req, res, next) {

	var action = new r.prototypes.Action(arguments);
	action.id = req.query.action;

	new r.Promise(function(resolve, reject) {

		r.modules.authorize.captcha(action).then(function() {

			var user = new r.User({
				email: req.body.email,
				username: req.body.username,
				password: req.body.password,
				firstname: req.body.firstname,
				lastname: req.body.lastname,
				country: req.body.country,
				config: {
					language: req.session.language,
					theme: req.session.theme
				}
			});

			if (req.body._id) { user._id = req.body._id; }

			user.save(function(err) {

				if (!err) {

					resolve({
						user: user,
						authToken: r.jwt.sign({ _id: user._id }, process.env.AUTH_SECRET, { expiresIn: global.app.get('AUTH_TOKEN_EXPIRES_IN') }),
						msg: {
							title: r.hardData[req.session.language].msgs.titles[0],
							info: r.hardData[req.session.language].msgs.infos[0]
						}
					});

				} else {

					action.setAsBad();
					reject(err);
				}
			});
		});

	}).then(function(data) {

		r.modules.socketModule.emitUsersCount();

		action.resetBadCount();
		action.end(200, data);

	}, function(err) {

		action.end(400, err);
	});
};