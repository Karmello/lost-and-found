const cm = require(global.paths.server + '/cm');

module.exports = (...args) => {

	let action = new cm.prototypes.Action(args);
	action.id = 'recover';

	let query = { email: action.req.body.email };
	let user = new cm.User(query);

	new cm.libs.Promise((resolve) => {

		user.validate((err) => {

			if (!err.errors.email || err.errors.email.kind == 'not_unique') {

				cm.User.findOne(query, (err, user) => {

					if (!err && user) {
						resolve(user);

					} else {

						action.end(400, {
							name: 'ValidationError',
							message: 'user validation failed',
							errors: { email: { kind: 'not_found' } }
						});
					}
				});

			} else {

				action.setAsBad();
				action.end(400, err);
			}
		});

	}).then((user) => {

		let token = cm.libs.jwt.sign({ email: user.email }, process.env.AUTH_SECRET, { expiresIn: cm.app.get('AUTH_TOKEN_EXPIRES_IN') });

		let mail = cm.modules.email.create('new_pass_link', action.req.session.language, user.email, {
			username: user.username,
            link: 'https://' + action.req.headers.host + '/reset_password?authToken=' + token
		});

        cm.modules.email.send(mail, (err, info) => {

            if (!err) {

            	action.resetBadCount();

            	action.end(200, {
            		msg: {
            			title: cm.hardData[action.eq.session.language].msgs.titles[2],
						info: cm.hardData[action.req.session.language].msgs.infos[3]
            		}
            	});

            } else { action.end(500, 'COULD_NOT_SEND_EMAIL'); }
        });
	});
};