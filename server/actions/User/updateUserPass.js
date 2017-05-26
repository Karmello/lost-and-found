var r = require(global.paths._requires);

module.exports = function(req, res, next) {

	var action = new r.prototypes.Action(arguments);
	action.id = req.query.action;

	r.modules.authorize.userToken(req, res, function() {

		new r.Promise(function(resolve, reject) {

			r.User.findOne({ _id: req.decoded._doc._id }, 'password', function(err, user) {

				if (!err && user) {

					var password;

					// Creating password instance
					password = new r.Password({
						userId: user._id,
						currentPassword: req.body.currentPassword,
						password: req.body.password
					});

					password.validate(function(err) {

						if (!err) {

							user.password = password.password;

							user.validate(function(err) {

								if (!err) {

									user.save({ validateBeforeSave: false }, function(err) {

										if (!err) {

											// Getting updated user to send back to the client
											r.User.findOne({ _id: user._id }, function(err, user) {
												if (!err && user) { resolve(user); } else { reject(err); }
											});

										} else { reject(err); }
									});

								} else if (err) {

									if (err.errors.email && err.errors.email.kind == 'not_unique' && req.body.email == req.decoded._doc.email) {

										delete err.errors.email;

										if (Object.keys(err.errors).length === 0) {
											return resolve();
										}
									}

									reject(err);
								}
							});

						} else { reject(err); }
					});

				} else { reject(err); }
			});

		}).then(function(user) {

			action.end(200, {
				user: user,
				authToken: r.jwt.sign(user, process.env.AUTH_SECRET, { expiresIn: global.app.get('AUTH_TOKEN_EXPIRES_IN') }),
				msg: {
					title: r.hardData[req.session.language].msgs.titles[1],
					info: r.hardData[req.session.language].msgs.infos[1]
				}
			});

		}, function(err) {
			action.end(400, err);
		});
	});
};