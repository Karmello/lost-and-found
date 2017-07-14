var path = global.paths.server + '/schemas/';

module.exports = {
	AppConfig: require(path + 'AppConfigSchema'),
	Comment: require(path + 'CommentSchema'),
	ContactType: require(path + 'ContactTypeSchema'),
	Counter: require(path + 'CounterSchema'),
	DeactivationReason: require(path + 'DeactivationReasonSchema'),
	Password: require(path + 'PasswordSchema'),
	Payment: require(path + 'PaymentSchema'),
	Report: require(path + 'ReportSchema'),
	User: require(path + 'UserSchema')
};