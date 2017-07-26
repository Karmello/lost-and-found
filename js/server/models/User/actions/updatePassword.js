const cm = require(global.paths.server + '/cm');

module.exports = (...args) => {

	let action = new cm.prototypes.Action(args);

	cm.User.authenticateToken(action.req, action.res, () => {

		new cm.libs.Promise((resolve, reject) => {
			cm.User.findOne({ _id: action.req.decoded._id }, 'password', (err, user) => {

				if (!err && user) {

					let password = new cm.Password({
						userId: user._id,
						current: action.req.body.current,
						password: action.req.body.password
					});

					password.validate((err) => {

						if (!err) {

							user.password = password.password;

							user.save((err) => {
								if (!err) { resolve(user._id); } else { reject(err); }
							});

						} else { reject(err); }
					});

				} else { reject(err); }
			});

		}).then((userId) => {

			action.end(200, {
				authToken: cm.libs.jwt.sign({ _id: userId }, process.env.AUTH_SECRET, { expiresIn: cm.app.get('AUTH_TOKEN_EXPIRES_IN') }),
				msg: {
					title: cm.hardData[action.req.session.language].msgs.titles[1],
					info: cm.hardData[action.req.session.language].msgs.infos[1]
				}
			});

		}, (err) => {
			action.end(400, err);
		});
	});
};