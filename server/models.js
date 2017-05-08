var path = global.paths.schemas;

module.exports = {
	AppConfig: require(path + 'AppConfigSchema'),
	User: require(path + 'UserSchema'),
	Password: require(path + 'PasswordSchema'),
	ItemCategory: require(path + 'ItemCategorySchema'),
	Item: require(path + 'ItemSchema'),
	Auction: require(path + 'AuctionSchema'),
	DeactivationReason: require(path + 'DeactivationReasonSchema'),
	ReportType: require(path + 'ReportTypeSchema'),
	Counter: require(path + 'CounterSchema'),
	Comment: require(path + 'CommentSchema')
};