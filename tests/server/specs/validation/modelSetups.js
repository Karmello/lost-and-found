var ic = require(__dirname + '/inputCases');

module.exports = {
	User: {
		email: {
			inputCases: [
				ic.value.undefined,
				ic.string.empty,
				ic.string.withSpacesOnly,
				ic.string.default,
				ic.User.email.tooLong
			]
		},
		username: {
			inputCases: [
				ic.value.undefined,
				ic.string.empty,
				ic.string.withSpacesOnly,
				ic.string.withSpecialChar,
				ic.string.withMultipleWords,
				ic.User.username.tooShort,
				ic.User.username.tooLong
			]
		},
		password: {
			inputCases: [
				ic.value.undefined,
				ic.string.empty,
				ic.string.withSpacesOnly,
				ic.string.withMultipleWords,
				ic.string.withSpecialChar,
				ic.User.password.tooShort,
				ic.User.password.tooLong
			]
		},
		firstname: {
			inputCases: [
				ic.value.undefined,
				ic.string.empty,
				ic.string.withSpacesOnly,
				ic.string.withSpecialChar,
				ic.string.withDigits,
				ic.User.firstname.tooLong
			]
		},
		lastname: {
			inputCases: [
				ic.value.undefined,
				ic.string.empty,
				ic.string.withSpacesOnly,
				ic.string.withSpecialChar,
				ic.string.withDigits,
				ic.User.lastname.tooLong
			]
		},
		country: {
			inputCases: [
				ic.value.undefined,
				ic.string.empty,
				ic.string.withSpacesOnly,
				ic.string.default
			]
		}
	},
	Report: {
		categoryId: {
			inputCases: [
				ic.value.undefined,
				ic.string.empty,
				ic.string.withSpacesOnly,
				ic.string.default
			]
		},
		subcategoryId: {
			inputCases: [
				ic.value.undefined,
				ic.string.empty,
				ic.string.withSpacesOnly,
				ic.string.default
			]
		},
		title: {
			inputCases: [
				ic.value.undefined,
				ic.string.empty,
				ic.string.withSpacesOnly,
				ic.Report.title.tooShort,
				ic.Report.title.tooLong
			]
		},
		description: {
			inputCases: [
				ic.value.undefined,
				ic.string.empty,
				ic.string.withSpacesOnly,
				ic.Report.description.tooShort,
				ic.Report.description.tooLong
			]
		},
		currency: {
			inputCases: [
				ic.value.undefined,
				ic.string.empty,
				ic.string.withSpacesOnly,
				ic.string.default
			]
		},
		initialValue: {
			inputCases: [
				ic.value.undefined,
				ic.number.negative,
				ic.number.fraction
			]
		},
		bidIncrement: {
			inputCases: [
				ic.value.undefined,
				ic.number.negative,
				ic.number.fraction
			]
		},
		minSellPrice: {
			inputCases: [
				ic.value.undefined,
				ic.number.negative,
				ic.number.fraction
			]
		},
		amount: {
			inputCases: [
				ic.value.undefined,
				ic.number.negative,
				ic.number.fraction
			]
		}
	}
};