var r = require(global.paths.server + '/requires');

module.exports = {
	before: function(req, res, next) {

		let action = new r.prototypes.Action(arguments);

		new r.Promise(function(resolve, reject) {

			r.User.findOne({ _id: req.params.id }, 'email firstname lastname country photos config', function(err, user) {

				if (!err && user) {

					user.email = req.body.email;
					user.firstname = req.body.firstname;
					user.lastname = req.body.lastname;
					user.country = req.body.country;
					user.photos = req.body.photos.slice(0, 1);
					user.config = req.body.config;

					new r.Promise(function(resolve) {

						user.validate(function(err) {

							if (!err) {
								resolve();

							} else if (err) {

								if (err.errors.email && err.errors.email.kind == 'not_unique' && user.email == req.body.email) {
									delete err.errors.email;
									if (Object.keys(err.errors).length === 0) { return resolve(); }
								}

								reject(err);
							}
						});

					}).then(function() {

						user.save({ validateBeforeSave: false }, function(err) {
							if (!err) { resolve(user); } else { reject(err); }
						});
					});

				} else { reject(err); }
			});

		}).then(function(user) {

			let msg = { title: r.hardData[req.session.language].msgs.titles[1] };

			if (req.headers.action === 'userConfigUpdate') {
                msg.info = r.hardData[req.session.language].msgs.infos[2];
				msg.reload = true;
				req.session.theme = user.config.theme;
                req.session.language = user.config.language;

			} else {
				msg.info = r.hardData[req.session.language].msgs.infos[1];
			}

			action.end(200, {
				authToken: r.jwt.sign({ _id: user._id }, process.env.AUTH_SECRET, { expiresIn: global.app.get('AUTH_TOKEN_EXPIRES_IN') }),
				msg: msg
			});

		}, function(err) {
			action.end(400, err);
		});
	}
};