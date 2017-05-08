var r = require(global.paths._requires);

module.exports = function(app, route) {

	var rest = r.restful.model('item_category', app.models.ItemCategory).methods(['get']);
	rest.before('get', [r.modules.authorize.userToken, r.actions.item_category.get.before]);
	rest.register(app, route);
	return function(req, res, next) { next(); };
};