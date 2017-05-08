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
	item_category: {
		get: require('./ItemCategory/getItemCategories')
	},
	item: {
		post: require('./Item/postItem'),
		get: require('./Item/getItem'),
		put: require('./Item/putItem'),
		delete: require('./Item/deleteItem'),
	},
	auction: {
		post: require('./Auction/postAuction'),
		get: require('./Auction/getAuction'),
		put: require('./Auction/putAuction'),
		delete: require('./Auction/deleteAuction'),
	},
	comment: {
		post: require('./Comment/postComment'),
		get: require('./Comment/getComment'),
		delete: require('./Comment/deleteComment')
	},
	deactivation_reason: {
		get: require('./DeactivationReason/getDeactivationReasons')
	},
	report_type: {
		post: require('./ReportType/postReport'),
		get: require('./ReportType/getReportTypes')
	}
};