var r = require(global.paths._requires);

module.exports = function(app, route) {

	var rest = r.restful.model('contact_type', app.models.ContactType).methods(['get', 'post']);

	rest.before('get', r.actions.contact_type.get.before);
	rest.before('post', [r.modules.authorize.userToken, r.actions.contact_type.post.before]);

	rest.register(app, route);
	return function(req, res, next) { next(); };
};