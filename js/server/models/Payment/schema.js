const cm = require(global.paths.server + '/cm');

module.exports = new cm.libs.mongoose.Schema({
	paymentId: {
		type: String
	},
	paymentMethod: {
		type: String,
		required: true,
		validate: [cm.modules.validator.get('Payment', 'paymentMethod', 'correctness')]
	},
	currency: {
		type: String,
		required: true,
		validate: [cm.modules.validator.get('Payment', 'currency', 'correctness')]
	},
	amount: {
		type: Number,
		required: true
	},
	creditCardType: {
		type: String,
		required: function() {
			return this.paymentMethod == 'credit_card';
		},
		validate: [cm.modules.validator.get('Payment', 'creditCardType', 'correctness')]
	},
	creditCardNumber: {
		type: String,
		required: function() {
			return this.paymentMethod == 'credit_card';
		},
		validate: [cm.modules.validator.get('Payment', 'creditCardNumber', 'correctness')]
	},
	creditCardExpireMonth: {
		type: String,
		required: function() {
			return this.paymentMethod == 'credit_card';
		},
		validate: [cm.modules.validator.get('Payment', 'creditCardExpireMonth', 'correctness')]
	},
	creditCardExpireYear: {
		type: String,
		required: function() {
			return this.paymentMethod == 'credit_card';
		},
		validate: [cm.modules.validator.get('Payment', 'creditCardExpireYear', 'correctness')]
	},
	cvv2: {
		type: String,
		required: function() {
			return this.paymentMethod == 'credit_card';
		},
		validate: [cm.modules.validator.get('Payment', 'cvv2', 'correctness')]
	},
	firstname: {
		type: String,
		required: function() {
			return this.paymentMethod == 'credit_card';
		},
	},
	lastname: {
		type: String,
		required: function() {
			return this.paymentMethod == 'credit_card';
		},
	},
	userId: {
		type: cm.libs.mongoose.Schema.Types.ObjectId,
		ref: 'user',
		required: true
	}
}, { versionKey: false });