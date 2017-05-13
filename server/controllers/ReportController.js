var r = require(global.paths._requires);

module.exports = function(app, route) {

	var authorize = r.modules.authorize;
	var rest = r.restful.model('report', app.models.Report).methods(['post', 'get', 'put', 'delete']);

	rest.before('post', [authorize.userToken, authorize.reportAction, r.actions.report.post.before]);
	rest.before('get', [authorize.userToken, authorize.reportAction, r.actions.report.get.before]);
	rest.before('put', [authorize.userToken, authorize.reportAction, r.actions.report.put.before]);
	rest.after('put', r.actions.report.put.after);
	rest.before('delete', [authorize.userToken, authorize.reportAction, r.actions.report.delete.before]);

	rest.register(app, route);
	return function(req, res, next) { next(); };
};