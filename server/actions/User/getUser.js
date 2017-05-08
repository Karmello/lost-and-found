var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		// By itemId
		if (req.query.itemId) {

			r.Item.findOne({ _id: req.query.itemId}, function(err, item) {

				if (!err && item) {
					r.User.findOne({ _id: item.userId }, function(err, user) {

						if (!err && user) {
							res.status(200).send([user]);

						} else { res.status(400).send(err); }
					});

				} else { res.status(400).send(err); }
			});

		// By auctionId
		} else if (req.query.auctionId) {

			r.Auction.findOne({ _id: req.query.auctionId }, function(err, auction) {

				if (!err && auction) {

					r.User.find({ _id: { $in: auction.subscribers } }, function(err, users) {

						if (!err && users) {
							res.status(200).send(users);

						} else { res.status(400).send(err); }
					});

				} else { res.status(400).send(err); }
			});

		} else {
			return next();
		}
	}
};