module.exports = {
	comment: {
		delete: require('./Comment/deleteComment'),
		get: require('./Comment/getComment'),
		post: require('./Comment/postComment'),
		put: require('./Comment/putComment')
	},
	contact_type: {
		get: require('./ContactType/getContactTypes'),
		post: require('./ContactType/postContactType')
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
		delete: require('./Report/deleteReport'),
		getById: require('./Report/getReportById'),
		getByIds: require('./Report/getReportByIds'),
		getByQuery: require('./Report/getReportBySearchQuery'),
		post: require('./Report/postReport'),
		put: require('./Report/putReport'),
		runValidation: require('./Report/runReportValidation')
	},
	user: {
		delete: require('./User/deleteUser'),
		get: require('./User/getUser'),
		post: {
			auth: require('./User/authUser'),
			login: require('./User/loginUser'),
			register: require('./User/registerUser'),
			updatePass: require('./User/updateUserPass')
		},
		put: require('./User/putUser')
	}
};