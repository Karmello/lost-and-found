var r = require(global.paths._requires);

module.exports = function(req, res, next) {

	var action = new r.prototypes.Action(arguments);
	action.id = req.query.action;

	r.modules.authorize.userToken(req, res, function() {

		new r.Promise(function(resolve, reject) {

			r.User.findOne({ _id: req.decoded._id }, function(err, user) {

				if (!err && user) {

					r.AppConfig.findOne({ userId: user._id }, function(err, appConfig) {

						if (!err && appConfig) {

							req.session.theme = appConfig.theme;
							req.session.language = appConfig.language;

							resolve({
								user: user,
								appConfig: appConfig
							});

						} else { reject(err); }
					});

				} else { reject(err); }
			});

		}).then(function(data) {

			action.end(200, data);

		}, function(err) {

			action.end(400, err);
		});
	});
};