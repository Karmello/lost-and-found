const cm = require(global.paths.server + '/cm');

module.exports = (app, route) => {

	let rest = cm.libs.restful.model('contact_type', app.models.ContactType).methods(['get', 'post']);
	cm.ContactType = rest;

	rest.before('get', cm.actions.contact_type.get);
	rest.before('post', [cm.User.validateUserToken, cm.actions.contact_type.post]);

	rest.register(app, route);
	return (req, res, next) => { next(); };
};