module.exports = {
	app_config: {
		put: require('./AppConfig/putAppConfig'),
	},
	user: {
		post: require('./User/postUser'),
		get: require('./User/getUser'),
		put: require('./User/putUser'),
		delete: require('./User/deleteUser')
	},
	password: {
		recover: require('./Password/recoverPassword'),
		reset: require('./Password/resetPassword')
	},
	report_category: {
		get: require('./ReportCategory/getReportCategories')
	},
	report: {
		post: require('./Report/postReport'),
		getById: require('./Report/getReportById'),
		getByUserId: require('./Report/getReportByUserId'),
		getBySearchQuery: require('./Report/getReportBySearchQuery'),
		getByIds: require('./Report/getReportByIds'),
		put: require('./Report/putReport'),
		delete: require('./Report/deleteReport'),
	},
	comment: {
		post: require('./Comment/postComment'),
		get: require('./Comment/getComment'),
		delete: require('./Comment/deleteComment')
	},
	deactivation_reason: {
		get: require('./DeactivationReason/getDeactivationReasons')
	},
	contact_type: {
		post: require('./ContactType/postContactType'),
		get: require('./ContactType/getContactTypes')
	},
	other: {
		getStats: require('./Other/getStats')
	}
};