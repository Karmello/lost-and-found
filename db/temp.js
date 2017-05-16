use laf-dev



// db.users.find({
// 	_id: {
// 		$in: db.reports.find({
// 			_id: {
// 				$in: db.auctions.find({}, { _id: 0, reportId: 1 }).map(function(auction) { return auction.reportId; })
// 			}
// 		}, { _id: 0, userId: 1 }).map(function(report) { return report.userId; })
// 	}
// }, { _id: 0, username: 1 }).map(function(user) { return user.username; });

// db.app_configs.find({
// 	userId: {
// 		$nin: db.users.find({}).map(function(user) { return user._id; })
// 	}
// }).map(function(appConfig) { return appConfig._id; });



// db.app_configs.remove({
// 	userId: {
// 		$nin: db.users.find({}).map(function(user) { return user._id; })
// 	}
// });



db.users.update({}, {
	$set: {
		account: 'basic'
	}
}, { multi: true });