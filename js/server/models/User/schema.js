const cm = require(global.paths.server + '/cm');

module.exports = new cm.libs.mongoose.Schema({
	email: {
		type: String,
		required: true,
		validate: [
			cm.modules.validator.get('User', 'email', 'correctness'),
			cm.modules.validator.length.get('User', 'email'),
			cm.modules.validator.get('User', 'email', 'uniqueness')
		]
	},
	username: {
		type: String,
		required: true,
		validate: [
			cm.modules.validator.string.noSpecialChars,
			cm.modules.validator.string.noMultipleWords,
			cm.modules.validator.length.get('User', 'username'),
			cm.modules.validator.get('User', 'username', 'uniqueness')
		]
	},
	password: {
		type: String,
		required: true,
		validate: [
			cm.modules.validator.string.noSpecialChars,
			cm.modules.validator.string.noMultipleWords,
			cm.modules.validator.length.get('User', 'password')
		]
	},
	firstname: {
		type: String,
		required: true,
		validate: [
			cm.modules.validator.string.noSpecialChars,
			cm.modules.validator.string.noDigits,
			cm.modules.validator.length.get('User', 'firstname')
		]
	},
	lastname: {
		type: String,
		required: true,
		validate: [
			cm.modules.validator.string.noSpecialChars,
			cm.modules.validator.string.noDigits,
			cm.modules.validator.length.get('User', 'lastname')
		]
	},
	country: {
		type: String,
        required: true,
        validate: [
        	cm.modules.validator.get('User', 'country', 'correctness')
        ]
	},
	registration_date: {
		type: Date,
		default: Date.now
	},
	photos: [{
		filename: {
			type: String,
			required: true
		},
		size: {
			type: Number,
			required: true
		}
	}],
	reportsRecentlyViewed: [{ type: cm.libs.mongoose.Schema.Types.ObjectId, ref: 'user' }],
	paymentId: {
		type: String
	},
	config: {
		language: {
			type: String,
			required: false
		},
		theme: {
			type: String,
			required: true
		}
	}
}, { versionKey: false });