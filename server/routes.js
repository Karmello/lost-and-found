module.exports = {
	'/app_configs': require(global.paths.controllers + 'AppConfigController'),
	'/users': require(global.paths.controllers + 'UserController'),
	'/password': require(global.paths.controllers + 'PasswordController'),
	'/report_categories': require(global.paths.controllers + 'ReportCategoryController'),
	'/reports': require(global.paths.controllers + 'ReportController'),
	'/deactivation_reasons': require(global.paths.controllers + 'DeactivationReasonController'),
	'/contact_types': require(global.paths.controllers + 'ContactTypeController'),
	'/counters': require(global.paths.controllers + 'CounterController'),
	'/comments': require(global.paths.controllers + 'CommentController')
};