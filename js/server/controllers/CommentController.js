var r = require(global.paths.server + '/requires');

module.exports = function(app, route) {

	var rest = r.restful.model('comment', app.models.Comment).methods(['post', 'get', 'put', 'delete']);

	rest.before('post', [r.modules.authorize.userToken, r.actions.comment.post.before]);
	rest.before('get', [r.actions.comment.get.before]);
	rest.before('put', [r.modules.authorize.userToken, r.actions.comment.put.before]);
	rest.before('delete', [r.modules.authorize.userToken, r.actions.comment.delete.before]);

	rest.register(app, route);
	return function(req, res, next) { next(); };
};