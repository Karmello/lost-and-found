const cm = require(global.paths.server + '/cm');

module.exports = (...args) => {

	let action = new cm.prototypes.Action(args);

	let user = new cm.User({
		email: action.req.body.email,
		username: action.req.body.username,
		password: action.req.body.password,
		firstname: action.req.body.firstname,
		lastname: action.req.body.lastname,
		country: action.req.body.country,
		config: {
			language: action.req.session.language,
			theme: action.req.session.theme
		}
	});

	if (action.req.body._id) { user._id = action.req.body._id; }

	user.save().then(() => {

		cm.User.emitUsersCount();
		action.resetBadCount();

		action.end(200, {
			user: user,
			authToken: cm.libs.jwt.sign({ _id: user._id }, process.env.AUTH_SECRET, { expiresIn: cm.app.get('AUTH_TOKEN_EXPIRES_IN') }),
			msg: {
				title: cm.hardData[action.req.session.language].msgs.titles[0],
				info: cm.hardData[action.req.session.language].msgs.infos[0]
			}
		});

	}, (err) => {

		action.setAsBad();
		action.end(400, err);
	});
};