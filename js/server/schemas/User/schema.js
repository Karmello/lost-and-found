const cm = require(global.paths.server + '/cm');
const glVal = cm.validators.globalValidators;
const userVal = cm.validators.userValidators;

module.exports = new cm.libs.mongoose.Schema({
	email: {
		type: String,
		required: true,
		validate: [userVal.email.correctness, userVal.email.length, userVal.email.uniqueness]
	},
	username: {
		type: String,
		required: true,
		validate: [glVal.string.no_special_chars, glVal.string.no_multiple_words, userVal.username.length, userVal.username.uniqueness]
	},
	password: {
		type: String,
		required: true,
		validate: [glVal.string.no_special_chars, glVal.string.no_multiple_words, userVal.password.length]
	},
	firstname: {
		type: String,
		required: true,
		validate: [glVal.string.no_special_chars, glVal.string.no_digits, userVal.firstname.length]
	},
	lastname: {
		type: String,
		required: true,
		validate: [glVal.string.no_special_chars, glVal.string.no_digits, userVal.lastname.length]
	},
	country: {
		type: String,
        required: true,
        validate: [userVal.country.correctness]
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