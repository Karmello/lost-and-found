var path = global.paths.server + '/schemas/';

module.exports = {
	Comment: require(path + 'CommentSchema'),
	ContactType: require(path + 'ContactTypeSchema'),
	Counter: require(path + 'CounterSchema'),
	DeactivationReason: require(path + 'DeactivationReasonSchema'),
	Payment: require(path + 'PaymentSchema'),
	Report: require(path + 'ReportSchema'),
	User: require(path + 'UserSchema')
};