var r = require(global.paths._requires);

module.exports = function(app, route) {

	var rest = r.restful.model('deactivation_reason', app.models.DeactivationReason).methods(['get']);
	rest.before('get', [r.modules.authorize.userToken, r.actions.deactivation_reason.get.before]);
	rest.register(app, route);
	return function(req, res, next) { next(); };
};