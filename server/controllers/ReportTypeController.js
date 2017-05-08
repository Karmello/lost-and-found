var r = require(global.paths._requires);

module.exports = function(app, route) {

	var rest = r.restful.model('report_type', app.models.ReportType).methods(['get', 'post']);

	rest.before('get', [r.modules.authorize.userToken, r.actions.report_type.get.before]);
	rest.before('post', [r.modules.authorize.userToken, r.actions.report_type.post.before]);

	rest.register(app, route);
	return function(req, res, next) { next(); };
};