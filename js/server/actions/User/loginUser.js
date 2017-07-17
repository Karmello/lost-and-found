var r = require(global.paths.server + '/requires');

module.exports = function(req, res, next) {

	var action = new r.prototypes.Action(arguments);
	action.id = req.query.action;

	var wrongCredentialsErr = {
		name: 'ValidationError',
		message: 'user validation failed',
		errors: { username: { kind: 'wrong_credentials' } }
	};

	new r.Promise(function(resolve, reject) {

		r.modules.authorize.captcha(action).then(function() {

			r.User.findOne({ username: req.body.username }, function(err, user) {

				if (!err && user) {

					user.comparePasswords(req.body.password, function(err, isMatch) {

						if (isMatch) {

							req.session.theme = user.config.theme;
							req.session.language = user.config.language;

							resolve({
								user: user,
								authToken: r.jwt.sign({ _id: user._id }, process.env.AUTH_SECRET, { expiresIn: global.app.get('AUTH_TOKEN_EXPIRES_IN') })
							});

						} else {

							action.setAsBad();
							reject(wrongCredentialsErr);
						}
					});

				} else {

					action.setAsBad();
					reject(wrongCredentialsErr);
				}
			});
		});

	}).then(function(data) {

		action.resetBadCount();
		action.end(200, data);

	}, function(err) {

		action.end(400, err);
	});
};