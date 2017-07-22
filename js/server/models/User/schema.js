const cm = require(global.paths.server + '/cm');

module.exports = new cm.libs.mongoose.Schema({
	email: {
		type: String,
		required: true,
		validate: [
			cm.validators.get('User', 'email', 'correctness'),
			cm.validators.length.get('User', 'email'),
			cm.validators.get('User', 'email', 'uniqueness')
		]
	},
	username: {
		type: String,
		required: true,
		validate: [
			cm.validators.string.noSpecialChars,
			cm.validators.string.noMultipleWords,
			cm.validators.length.get('User', 'username'),
			cm.validators.get('User', 'username', 'uniqueness')
		]
	},
	password: {
		type: String,
		required: true,
		validate: [
			cm.validators.string.noSpecialChars,
			cm.validators.string.noMultipleWords,
			cm.validators.length.get('User', 'password')
		]
	},
	firstname: {
		type: String,
		required: true,
		validate: [
			cm.validators.string.noSpecialChars,
			cm.validators.string.noDigits,
			cm.validators.length.get('User', 'firstname')
		]
	},
	lastname: {
		type: String,
		required: true,
		validate: [
			cm.validators.string.noSpecialChars,
			cm.validators.string.noDigits,
			cm.validators.length.get('User', 'lastname')
		]
	},
	country: {
		type: String,
        required: true,
        validate: [
        	cm.validators.get('User', 'country', 'correctness')
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