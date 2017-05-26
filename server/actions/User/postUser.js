var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		var action = new r.prototypes.Action(arguments);
		var query;

		var wrongCredentialsErr = {
			name: 'ValidationError',
			message: 'user validation failed',
			errors: { username: { kind: 'wrong_credentials' } }
		};



		new r.Promise(function(resolve) {

			switch (req.query.action) {

				case 'auth':

					r.modules.authorize.userToken(req, res, function() {
						resolve({ query: { _id: req.decoded._doc._id } });
					});

					break;

				case 'login':
				case 'register':

					resolve({ query: { username: req.body.username } });
					break;
			}

		}).then(function(config) {

			action.id = req.query.action;
			query = config.query;

			new r.Promise(function(resolve) {

				if (action.id == 'register') {
					resolve(new r.User(req.body));

				} else {

					r.User.findOne(query, function(err, user) {

						if (!err && user) {
							resolve(user);

						} else {

							if (action.id == 'login') {
								action.setAsBad();
								err = wrongCredentialsErr;
							}

							action.end(400, err);
						}
					});
				}

			}).then(function(user) {

				new r.Promise(function(resolve) {

					if (action.id == 'auth') {
						resolve(user);

					} else {

						r.modules.captchaModule.verify(action).then(function() {
							resolve(user);
						});
					}

				}).then(function(user) {

					new r.Promise(function(resolve) {

						if (action.id == 'auth') {
							return resolve(user);

						} else {

							new r.Promise(function(resolve) {

								switch (action.id) {

									case 'login':

										user.comparePasswords(req.body.password, function(err, isMatch) {
											if (!isMatch) { err = wrongCredentialsErr; } else { err = null; }
											resolve(err);
										});

										break;

									case 'register':
										user.save(function(err) { resolve(err); });
										break;
								}

							}).then(function(err) {

								if (!err) {
									action.resetBadCount();
									resolve(user);

								} else {
									action.setAsBad();
									action.end(400, err);
								}
							});
						}

					}).then(function(user) {

						new r.Promise(function(resolve) {

							if (action.id == 'register') {

								var appConfig = new r.AppConfig({
									userId: user._id,
									language: req.session.language,
									theme: req.session.theme
								});

								appConfig.save(function(err) {
									if (!err) { resolve(appConfig); } else { res.status(400).send(err); }
								});

							} else {

								r.AppConfig.findOne({ userId: user._id }, function(err, appConfig) {
									if (!err && appConfig) { resolve(appConfig); } else { res.status(400).send(err); }
								});
							}

						}).then(function(appConfig) {

							req.session.theme = appConfig.theme;
							req.session.language = appConfig.language;

							var body = { user: user, appConfig: appConfig };

							if (action.id != 'auth') {
								body.authToken = r.jwt.sign(user, process.env.AUTH_SECRET, { expiresIn: global.app.get('AUTH_TOKEN_EXPIRES_IN') });
							}

							if (action.id == 'register') {

								r.modules.socketModule.emitUsersCount();

								body.msg = {
									title: r.hardData[req.session.language].msgs.titles[0],
									info: r.hardData[req.session.language].msgs.infos[0]
								};
							}

							res.status(200).send(body);
						});
					});
				});
			});
		});
	}
};