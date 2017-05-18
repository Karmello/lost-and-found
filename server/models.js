var path = global.paths.schemas;

module.exports = {
	AppConfig: require(path + 'AppConfigSchema'),
	Comment: require(path + 'CommentSchema'),
	ContactType: require(path + 'ContactTypeSchema'),
	Counter: require(path + 'CounterSchema'),
	DeactivationReason: require(path + 'DeactivationReasonSchema'),
	Password: require(path + 'PasswordSchema'),
	Payment: require(path + 'PaymentSchema'),
	Report: require(path + 'ReportSchema'),
	ReportCategory: require(path + 'ReportCategorySchema'),
	User: require(path + 'UserSchema')
};