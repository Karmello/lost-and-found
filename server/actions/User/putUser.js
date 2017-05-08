var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		var isUpdatingPassword = function() {
			return req.body.currentPassword !== undefined && req.body.password !== undefined;
		};

		var action = new r.prototypes.Action(arguments);
		var selector;
		if (isUpdatingPassword()) { selector = 'password'; } else { selector = '-username -password -registration_date'; }



		new r.Promise(function(resolve, reject) {

			r.User.findOne({ _id: req.body._id }, selector, function(err, user) {

				if (!err && user) {

					var password;

					new r.Promise(function(resolve) {

						if (isUpdatingPassword()) {

							// Creating password instance
							password = new r.Password({
								userId: req.body._id,
								currentPassword: req.body.currentPassword,
								password: req.body.password
							});

							password.validate(function(err) {
								if (!err) { resolve(); } else { reject(err); }
							});

						} else { resolve(); }

					}).then(function() {

						if (isUpdatingPassword()) {
							user.password = password.password;

						} else {
							user.email = req.body.email;
							user.firstname = req.body.firstname;
							user.lastname = req.body.lastname;
							user.country = req.body.country;
							user.photos = req.body.photos.slice(0, 1);
						}

						new r.Promise(function(resolve) {

								user.validate(function(err) {

								if (!err) {
									resolve();

								} else if (err) {

									if (err.errors.email && err.errors.email.kind == 'not_unique' && req.body.email == req.decoded._doc.email) {
										delete err.errors.email;
										if (Object.keys(err.errors).length === 0) { return resolve(); }
									}

									reject(err);
								}
							});

						}).then(function() {

							user.save({ validateBeforeSave: false }, function(err) {

								if (!err) {

									// Getting updated user to send back to the client
									r.User.findOne({ _id: req.params.id }, function(err, user) {
										if (!err && user) { resolve(user); } else { reject(err); }
									});

								} else { reject(err); }
							});
						});
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
	}
};