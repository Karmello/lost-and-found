const cm = require(global.paths.server + '/cm');

module.exports = new cm.libs.mongoose.Schema({
	userId: {
		type: cm.libs.mongoose.Schema.Types.ObjectId,
		ref: 'user',
		required: true
	},
	currentPassword: {
		type: String,
		required: true,
		validate: [cm.modules.validator.get('Password', 'currentPassword', 'correctness')]
	},
	password: {
		type: String,
		required: true,
		validate: [
			cm.modules.validator.string.noSpecialChars,
			cm.modules.validator.string.noMultipleWords,
			cm.modules.validator.length.get('User', 'password')
		]
	}
}, { _id: false });