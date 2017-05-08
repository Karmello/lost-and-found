use laf-dev

// db.users.find({
// 	_id: {
// 		$in: db.items.find({
// 			_id: {
// 				$in: db.auctions.find({}, { _id: 0, itemId: 1 }).map(function(auction) { return auction.itemId; })
// 			}
// 		}, { _id: 0, userId: 1 }).map(function(item) { return item.userId; })
// 	}
// }, { _id: 0, username: 1 }).map(function(user) { return user.username; });

// db.app_configs.find({
// 	userId: {
// 		$nin: db.users.find({}).map(function(user) { return user._id; })
// 	}
// }).map(function(appConfig) { return appConfig._id; });

db.app_configs.remove({
	userId: {
		$nin: db.users.find({}).map(function(user) { return user._id; })
	}
});