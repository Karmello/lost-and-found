var r = require(global.paths.server + '/requires');

module.exports = function(app, route) {

	var rest = r.restful.model('app_config', app.models.AppConfig).methods(['put']);

	rest.before('put', [r.modules.authorize.userToken, r.actions.app_config.put.before]);
	rest.register(app, route);

	return function(req, res, next) { next(); };
};