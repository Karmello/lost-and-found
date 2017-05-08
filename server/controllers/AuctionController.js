var r = require(global.paths._requires);

module.exports = function(app, route) {

	var authorize = r.modules.authorize;
	var rest = r.restful.model('auction', app.models.Auction).methods(['post', 'get', 'put', 'delete']);

	rest.before('post', [authorize.userToken, authorize.auctionAction, r.actions.auction.post.before]);
	rest.before('get', [authorize.userToken, authorize.auctionAction, r.actions.auction.get.before]);
	rest.before('put', [authorize.userToken, authorize.auctionAction, r.actions.auction.put.before]);
	rest.after('put', r.actions.auction.put.after);
	rest.before('delete', [authorize.userToken, authorize.auctionAction, r.actions.auction.delete.before]);

	rest.register(app, route);
	return function(req, res, next) { next(); };
};