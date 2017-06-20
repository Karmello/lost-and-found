var r = require(global.paths._requires);

module.exports = function(app, route) {

	var authorize = r.modules.authorize;
	var rest = r.restful.model('report', app.models.Report).methods(['post', 'get', 'put', 'delete']);

	rest.before('post', [authorize.userToken, authorize.reportAction, r.actions.report.post.before]);
	rest.after('post', r.actions.report.post.after);

	rest.before('get', [authorize.reportAction, function(req, res, next) {

		switch (req.query.subject) {

			case 'bySearchQuery':
			case 'newlyAdded':
			case 'byUser':
				r.actions.report.getByQuery(req, res, next);
				break;

			case 'lastViewed':
				authorize.userToken(req, res, function() {
					r.actions.report.getByIds(req, res, next);
				});
				break;

			case 'singleOne':
				authorize.userToken(req, res, function() {
					r.actions.report.getById(req, res, next);
				});
				break;
		}
	}]);

	rest.before('put', [authorize.userToken, authorize.reportAction, r.actions.report.put.before]);
	rest.before('delete', [authorize.userToken, authorize.reportAction, r.actions.report.delete.before]);

	rest.register(app, route);
	return function(req, res, next) { next(); };
};