module.exports = {
	'/app_configs': require(global.paths.controllers + 'AppConfigController'),
	'/comments': require(global.paths.controllers + 'CommentController'),
	'/contact_types': require(global.paths.controllers + 'ContactTypeController'),
	'/counters': require(global.paths.controllers + 'CounterController'),
	'/deactivation_reasons': require(global.paths.controllers + 'DeactivationReasonController'),
	'/password': require(global.paths.controllers + 'PasswordController'),
	'/payments': require(global.paths.controllers + 'PaymentController'),
	'/reports': require(global.paths.controllers + 'ReportController'),
	'/report_categories': require(global.paths.controllers + 'ReportCategoryController'),
	'/users': require(global.paths.controllers + 'UserController')
};