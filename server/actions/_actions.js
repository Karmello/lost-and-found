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
	}
};