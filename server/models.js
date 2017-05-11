var path = global.paths.schemas;

module.exports = {
	AppConfig: require(path + 'AppConfigSchema'),
	User: require(path + 'UserSchema'),
	Password: require(path + 'PasswordSchema'),
	ItemCategory: require(path + 'ItemCategorySchema'),
	Item: require(path + 'ItemSchema'),
	DeactivationReason: require(path + 'DeactivationReasonSchema'),
	ContactType: require(path + 'ContactTypeSchema'),
	Counter: require(path + 'CounterSchema'),
	Comment: require(path + 'CommentSchema')
};