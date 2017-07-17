let path = global.paths.server + '/controllers/';

module.exports = {
	'/comments': require(path + 'CommentController'),
	'/contact_types': require(path + 'ContactTypeController'),
	'/counters': require(path + 'CounterController'),
	'/deactivation_reasons': require(path + 'DeactivationReasonController'),
	'/payments': require(path + 'PaymentController'),
	'/reports': require(path + 'ReportController'),
	'/users': require(path + 'UserController')
};