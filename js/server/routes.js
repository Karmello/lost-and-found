let path = global.paths.server + '/controllers/';

module.exports = {
	'/users': require(path + 'UserController'),
	'/reports': require(path + 'ReportController'),
	'/comments': require(path + 'CommentController'),
	'/payments': require(path + 'PaymentController'),
	'/deactivation_reasons': require(path + 'DeactivationReasonController'),
	'/contact_types': require(path + 'ContactTypeController'),
	'/counters': require(path + 'CounterController')
};