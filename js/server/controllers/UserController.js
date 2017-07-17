var r = require(global.paths.server + '/requires');

module.exports = function(app, route) {

	var authorize = r.modules.authorize;
	var rest = r.restful.model('user', app.models.User).methods(['post', 'get', 'put', 'delete']);

	rest.before('post', [authorize.userAction, function(req, res, next) {

		if (r.actions.user.post[req.query.action]) {
			r.actions.user.post[req.query.action](req, res, next);

		} else { res.send(400); }
	}]);

	rest.before('get', [authorize.userToken, r.actions.user.get.before]);
	rest.before('put', [authorize.userToken, authorize.userAction, r.actions.user.put.before]);
	rest.before('delete', [authorize.userToken, authorize.userAction, r.actions.user.delete.before]);

	rest.register(app, route);
	return function(req, res, next) { next(); };
};