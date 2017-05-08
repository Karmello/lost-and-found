var r = require(global.paths._requires);

module.exports = function(app, route) {

	var authorize = r.modules.authorize;
	var rest = r.restful.model('item', app.models.Item).methods(['post', 'get', 'put', 'delete']);

	rest.before('post', [authorize.userToken, authorize.itemAction, r.actions.item.post.before]);
	rest.before('get', [authorize.userToken, authorize.itemAction, r.actions.item.get.before]);
	rest.before('put', [authorize.userToken, authorize.itemAction, r.actions.item.put.before]);
	rest.after('put', r.actions.item.put.after);
	rest.before('delete', [authorize.userToken, authorize.itemAction, r.actions.item.delete.before]);

	rest.register(app, route);
	return function(req, res, next) { next(); };
};