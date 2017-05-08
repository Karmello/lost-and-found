var r = require(global.paths._requires);

module.exports = function(app, route) {

	var authorize = r.modules.authorize;
	var rest = r.restful.model('user', app.models.User).methods(['get', 'post', 'put', 'delete']);

	rest.before('post', [authorize.userAction, r.actions.user.post.before]);
	rest.before('get', [authorize.userToken, authorize.userAction, r.actions.user.get.before]);
	rest.before('put', [authorize.userToken, authorize.userAction, r.actions.user.put.before]);
	rest.before('delete', [authorize.userToken, authorize.userAction, r.actions.user.delete.before]);

	rest.register(app, route);
	return function(req, res, next) { next(); };
};