var r = require(global.paths._requires);

module.exports = function(app, route) {

	var authorize = r.modules.authorize;
	var rest = r.restful.model('report', app.models.Report).methods(['post', 'get', 'put', 'delete']);

	rest.before('post', [authorize.userToken, authorize.reportAction, r.actions.report.post.before]);
	rest.after('post', r.actions.report.post.after);

	rest.before('get', [authorize.reportAction, function(req, res, next) {

		switch (req.query.subject) {

			case 'report':
				authorize.userToken(req, res, function() {
					r.actions.report.getById(req, res, next);
				});
				break;

			case 'reports':
			case 'new_reports':
			case 'user_reports':
				r.actions.report.getByQuery(req, res, next);
				break;

			case 'recently_viewed_reports':
				authorize.userToken(req, res, function() {
					r.actions.report.getByIds(req, res, next);
				});
				break;
		}
	}]);

	rest.before('put', [authorize.userToken, authorize.reportAction, r.actions.report.put.before]);
	rest.after('put', r.actions.report.put.after);
	rest.before('delete', [authorize.userToken, authorize.reportAction, r.actions.report.delete.before]);

	rest.register(app, route);
	return function(req, res, next) { next(); };
};