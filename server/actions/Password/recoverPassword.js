var r = require(global.paths._requires);

module.exports = function(req, res, next) {

	var action = new r.prototypes.Action(arguments);
	action.id = 'recover';

	var query = { email: req.body.email };
	var user = new r.User(query);

	new r.Promise(function(resolve) {

		user.validate(function(err) {

			if (!err.errors.email || err.errors.email.kind == 'not_unique') {

				r.User.findOne(query, function(err, user) {

					if (!err && user) {
						resolve(user);

					} else {

						action.end(400, {
							name: 'ValidationError',
							message: 'user validation failed',
							errors: { email: { kind: 'not_found', properties: { msgIndex: 11 } } }
						});
					}
				});

			} else {

				action.setAsBad();
				action.end(400, err);
			}
		});

	}).then(function(user) {

		var body = { _doc: { email: user.email, username: user.username } };
		var token = r.jwt.sign(body, process.env.AUTH_SECRET, { expiresIn: global.app.get('AUTH_TOKEN_EXPIRES_IN') });

		var mail = r.modules.mailModule.create('new_pass_link', req.session.language, user.email, {
			username: user.username,
            link: 'http://' + req.headers.host + '/reset_password?authToken=' + token
		});

        r.modules.mailModule.send(mail, function(err, info) {

            if (!err) {

            	action.resetBadCount();

            	action.end(200, {
            		msg: {
            			title: r.hardData[req.session.language].msgs.titles[2],
						info: r.hardData[req.session.language].msgs.infos[3]
            		}
            	});

            } else {
            	action.end(500, 'COULD_NOT_SEND_EMAIL');
            }
        });
	});
};