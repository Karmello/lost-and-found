let path = global.paths.server + '/schemas/';

module.exports = {
	Comment: require(path + 'Comment/Comment'),
	ContactType: require(path + 'ContactType/ContactType'),
	Counter: require(path + 'Counter/Counter'),
	DeactivationReason: require(path + 'DeactivationReason/DeactivationReason'),
	Payment: require(path + 'Payment/Payment'),
	Report: require(path + 'Report/Report'),
	User: require(path + 'User/User')
};