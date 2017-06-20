var r = require(global.paths._requires);
var glVal = r.validators.globalValidators;
var userVal = r.validators.userValidators;
var passVal = r.validators.passwordValidators;

module.exports = new r.mongoose.Schema({
	userId: {
		type: r.mongoose.Schema.Types.ObjectId,
		ref: 'user',
		required: true
	},
	currentPassword: {
		type: String,
		required: true,
		validate: [passVal.compare]
	},
	password: {
		type: String,
		required: true,
		validate: [glVal.string.no_special_chars, glVal.string.no_multiple_words, userVal.password.length]
	}
}, { _id: false });