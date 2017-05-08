var r = require(global.paths._requires);

module.exports = function(app, route) {

	var rest = r.restful.model('password', app.models.Password).methods([]);
	rest.register(app, route);
	return function(req, res, next) { next(); };
};