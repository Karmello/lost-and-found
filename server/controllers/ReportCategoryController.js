var r = require(global.paths._requires);

module.exports = function(app, route) {

	var rest = r.restful.model('report_category', app.models.ReportCategory).methods(['get']);
	rest.before('get', [r.modules.authorize.userToken, r.actions.report_category.get.before]);
	rest.register(app, route);
	return function(req, res, next) { next(); };
};