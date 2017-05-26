var r = require(global.paths._requires);

module.exports = function(req, res, next) {

	var action = new r.prototypes.Action(arguments);
	action.id = req.query.action;

	var wrongCredentialsErr = {
		name: 'ValidationError',
		message: 'user validation failed',
		errors: { username: { kind: 'wrong_credentials' } }
	};

	new r.Promise(function(resolve, reject) {

		r.modules.captchaModule.verify(action).then(function() {

			r.User.findOne({ username: req.body.username }, function(err, user) {

				if (!err && user) {

					user.comparePasswords(req.body.password, function(err, isMatch) {

						if (isMatch) {

							r.AppConfig.findOne({ userId: user._id }, function(err, appConfig) {

								if (!err && appConfig) {

									req.session.theme = appConfig.theme;
									req.session.language = appConfig.language;

									var body = { user: user, appConfig: appConfig };
									body.authToken = r.jwt.sign(user, process.env.AUTH_SECRET, { expiresIn: global.app.get('AUTH_TOKEN_EXPIRES_IN') });

									resolve(body);

								} else { reject(err); }
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