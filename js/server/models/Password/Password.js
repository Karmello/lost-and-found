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
		validate: [cm.validators.get('Password', 'currentPassword', 'correctness')]
	},
	password: {
		type: String,
		required: true,
		validate: [
			cm.validators.string.noSpecialChars,
			cm.validators.string.noMultipleWords,
			cm.validators.length.get('User', 'password')
		]
	}
}, { _id: false });