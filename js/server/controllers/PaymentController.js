var r = require(global.paths._requires);

module.exports = function(app, route) {

	var authorize = r.modules.authorize;
	var rest = r.restful.model('payment', app.models.Payment).methods(['get', 'post']);

	rest.before('get', [authorize.userToken, authorize.paymentAction]);
	rest.before('post', [authorize.userToken, r.actions.payment.post.before]);
	rest.register(app, route);

	return function(req, res, next) { next(); };
};