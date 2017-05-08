var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		// Making sure no dups in subscribers array
		if (r._.uniq(req.body.subscribers).length == req.body.subscribers.length) {

			// Making sure not subscribing to an own item's auction
			r.Item.findOne({ _id: req.body.itemId }, function(err, item) {

				if (!err && item) {
					r.User.findOne({ _id: item.userId }, function(err, user) {

						if (!err && user) {

							if (user._id != req.decoded._doc._id) {
								next();

							} else { res.status(400).send('SUBSCRIBING_TO_AN_OWN_AUCTION_ERROR'); }

						} else { res.status(400).send(err); }
					});

				} else { res.status(400).send(err); }
			});

		} else { res.status(400).send('AUCTION_SUBSCRIBERS_DUPS_ERROR'); }
	},
	after: function(req, res, next) {

		// Getting updated auction to send back to the client
		r.Auction.findOne({ _id: req.params.id }, function(err, auction) {
			if (!err && auction) { res.status(200).send(auction); } else { res.status(400).send(err); }
		});
	}
};