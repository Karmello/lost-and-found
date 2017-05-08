var r = require(global.paths._requires);

module.exports = function(app, route) {

	var rest = r.restful.model('comment', app.models.Comment).methods(['post', 'get', 'delete']);

	rest.before('post', [r.modules.authorize.userToken, r.actions.comment.post.before]);
	rest.before('get', [r.modules.authorize.userToken, r.actions.comment.get.before]);
	rest.before('delete', [r.modules.authorize.userToken, r.actions.comment.delete.before]);

	rest.register(app, route);
	return function(req, res, next) { next(); };
};