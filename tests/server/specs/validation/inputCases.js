var helpers = require('./../../helpers');

module.exports = {
	value: {
		undefined: {
			value: undefined,
			description: 'is undefined',
			error: 'required',
			globalError: true
		}
	},
	string: {
		empty: {
			value: '',
			description: 'is empty string',
			error: 'required',
			globalError: true
		},
		default: {
			value: 'thisissomeincorrectvalue',
			description: 'is incorrect',
			error: 'incorrect'
		},
		withSpacesOnly: {
			value: '     ',
			description: 'contains only spaces',
			error: 'required',
			globalError: true
		},
		withSpecialChar: {
			value: 'specialcharvalue$',
			description: 'contains special char',
			error: 'string.special_chars_found',
			globalError: true
		},
		withMultipleWords: {
			value: 'this is multiple word string',
			description: 'contains multiple words',
			error: 'string.multiple_words_found',
			globalError: true
		},
		withDigits: {
			value: 'thisis9stringwithadigit',
			description: 'contains digit',
			error: 'string.digits_found',
			globalError: true
		}
	},
	number: {
		negative: {
			value: -5,
			description: 'is negative number',
			error: 'number.not_positive',
			globalError: true
		},
		fraction: {
			value: 4.5,
			description: 'is fraction',
			error: 'number.not_integer',
			globalError: true
		}
	},
	User: {
		email: {
			tooLong: {
				value: helpers.createString(global.app.get('USER_EMAIL_MAX_LENGTH')) + '@vp.pl',
				description: 'is too long',
				error: 'wrong_length'
			}
		},
		username: {
			tooShort: {
				value: helpers.createString(global.app.get('USER_USERNAME_MIN_LENGTH') - 1),
				description: 'is too short',
				error: 'wrong_length'
			},
			tooLong: {
				value: helpers.createString(global.app.get('USER_USERNAME_MAX_LENGTH') + 1),
				description: 'is too long',
				error: 'wrong_length'
			}
		},
		password: {
			tooShort: {
				value: helpers.createString(global.app.get('USER_PASSWORD_MIN_LENGTH') - 1),
				description: 'is too short',
				error: 'wrong_length'
			},
			tooLong: {
				value: helpers.createString(global.app.get('USER_PASSWORD_MAX_LENGTH') + 1),
				description: 'is too long',
				error: 'wrong_length'
			}
		},
		firstname: {
			tooLong: {
				value: helpers.createString(global.app.get('USER_FIRSTNAME_MAX_LENGTH') + 1),
				description: 'is too long',
				error: 'wrong_length'
			},
		},
		lastname: {
			tooLong: {
				value: helpers.createString(global.app.get('USER_LASTNAME_MAX_LENGTH') + 1),
				description: 'is too long',
				error: 'wrong_length'
			}
		}
	},
	Report: {
		title: {
			tooShort: {
				value: helpers.createString(global.app.get('REPORT_TITLE_MIN_LENGTH') - 1),
				description: 'is too short',
				error: 'wrong_length'
			},
			tooLong: {
				value: helpers.createString(global.app.get('REPORT_TITLE_MAX_LENGTH') + 1),
				description: 'is too long',
				error: 'wrong_length'
			}
		},
		description: {
			tooShort: {
				value: helpers.createString(global.app.get('REPORT_DESCRIPTION_MIN_LENGTH') - 1),
				description: 'is too short',
				error: 'wrong_length'
			},
			tooLong: {
				value: helpers.createString(global.app.get('REPORT_DESCRIPTION_MAX_LENGTH') + 1),
				description: 'is too long',
				error: 'wrong_length'
			}
		}
	}
};