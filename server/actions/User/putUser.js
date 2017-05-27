var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		var action = new r.prototypes.Action(arguments);

		new r.Promise(function(resolve, reject) {

			r.User.findOne({ _id: req.params.id }, 'email firstname lastname country photos', function(err, user) {

				if (!err && user) {

					user.email = req.body.email;
					user.firstname = req.body.firstname;
					user.lastname = req.body.lastname;
					user.country = req.body.country;
					user.photos = req.body.photos.slice(0, 1);

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
							if (!err) { resolve(user._id); } else { reject(err); }
						});
					});

				} else { reject(err); }
			});

		}).then(function(userId) {

			action.end(200, {
				authToken: r.jwt.sign({ _id: userId }, process.env.AUTH_SECRET, { expiresIn: global.app.get('AUTH_TOKEN_EXPIRES_IN') }),
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