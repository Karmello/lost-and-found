var r = require(global.paths._requires);

module.exports = function(req, res, next) {

	var action = new r.prototypes.Action(arguments);
	action.id = req.query.action;

	r.modules.authorize.userToken(req, res, function() {

		new r.Promise(function(resolve, reject) {

			r.User.findOne({ _id: req.decoded._id }, 'password', function(err, user) {

				if (!err && user) {

					var password = new r.Password({
						userId: user._id,
						currentPassword: req.body.currentPassword,
						password: req.body.password
					});

					password.validate(function(err) {

						if (!err) {

							user.password = password.password;

							user.save(function(err) {
								if (!err) { resolve(user._id); } else { reject(err); }
							});

						} else { reject(err); }
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
	});
};