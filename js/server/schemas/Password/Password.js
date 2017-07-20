const cm = require(global.paths.server + '/cm');
const glVal = cm.validators.globalValidators;
const userVal = cm.validators.userValidators;
const passVal = cm.validators.passwordValidators;

module.exports = new cm.libs.mongoose.Schema({
	userId: {
		type: cm.libs.mongoose.Schema.Types.ObjectId,
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