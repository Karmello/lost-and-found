let path = global.paths.server + '/controllers/';

module.exports = {
	'/app_configs': require(path + 'AppConfigController'),
	'/comments': require(path + 'CommentController'),
	'/contact_types': require(path + 'ContactTypeController'),
	'/counters': require(path + 'CounterController'),
	'/deactivation_reasons': require(path + 'DeactivationReasonController'),
	'/password': require(path + 'PasswordController'),
	'/payments': require(path + 'PaymentController'),
	'/reports': require(path + 'ReportController'),
	'/users': require(path + 'UserController')
};