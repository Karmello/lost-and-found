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
		validate: [cm.validation.get('Password', 'currentPassword', 'correctness')]
	},
	password: {
		type: String,
		required: true,
		validate: [
			cm.validation.string.noSpecialChars,
			cm.validation.string.noMultipleWords,
			cm.validation.length.get('User', 'password')
		]
	}
}, { _id: false });