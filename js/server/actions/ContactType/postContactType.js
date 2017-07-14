var r = require(global.paths.server + '/requires');

module.exports = {
	before: function(req, res, next) {

		var err = {
			name: 'ValidationError',
			message: 'contact_type validation failed',
			errors: {}
		};

		var action = new r.prototypes.Action(arguments);

		new r.Promise(function(resolve) {

			if (!req.body.contactType) { err.errors.contactType = { kind: 'required' }; }
			if (!req.body.contactMsg) { err.errors.contactMsg = { kind: 'required' }; }

			if (Object.keys(err.errors).length > 0) {
				action.end(400, err);

			} else {

				r.ContactType.findOne({ _id: req.body.contactType }, function(err, contactType) {
		    		if (!err && contactType) { resolve(contactType); } else { action.end(400, err); }
		    	});
			}

		}).then(function(contactType) {

			var mail = r.modules.mailModule.create('contact_msg', 'en', process.env.GMAIL_USER, {
				userId: req.decoded._id,
				username: req.decoded.username,
				contactType: contactType.label.en,
				number: contactType.count + 1,
				contactMsg: req.body.contactMsg
			});

			console.log('before sending');

			r.modules.mailModule.send(mail, function(err, info) {

				console.log('sending cb', err, info);

				if (!err) {

					contactType.count += 1;
					contactType.save();

					action.end(200, {
						msg: {
							title: req.decoded.username,
							info: r.hardData[req.session.language].msgs.infos[4]
						}
					});

				} else { action.end(400, err); }
			});
		});
	}
};