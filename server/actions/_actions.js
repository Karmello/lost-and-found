module.exports = {
	app_config: {
		put: require('./AppConfig/putAppConfig'),
	},
	comment: {
		post: require('./Comment/postComment'),
		get: require('./Comment/getComment'),
		delete: require('./Comment/deleteComment')
	},
	contact_type: {
		post: require('./ContactType/postContactType'),
		get: require('./ContactType/getContactTypes')
	},
	deactivation_reason: {
		get: require('./DeactivationReason/getDeactivationReasons')
	},
	other: {
		getStats: require('./Other/getStats')
	},
	password: {
		recover: require('./Password/recoverPassword'),
		reset: require('./Password/resetPassword')
	},
	payment: {
		post: require('./Payment/postPayment')
	},
	report: {
		post: require('./Report/postReport'),
		getById: require('./Report/getReportById'),
		getByIds: require('./Report/getReportByIds'),
		getByQuery: require('./Report/getReportBySearchQuery'),
		put: require('./Report/putReport'),
		delete: require('./Report/deleteReport'),
	},
	user: {
		post: require('./User/postUser'),
		get: require('./User/getUser'),
		put: require('./User/putUser'),
		delete: require('./User/deleteUser')
	}
};