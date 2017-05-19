var r = require(global.paths._requires);
var glVal = r.validators.globalValidators;
var payVal = r.validators.paymentValidators;



var PaymentSchema = new r.mongoose.Schema({
	paymentId: {
		type: String
	},
	paymentMethod: {
		type: String,
		required: true,
		validate: [payVal.method.correctness]
	},
	currency: {
		type: String,
		required: true,
		validate: [payVal.currency.correctness]
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
		validate: [payVal.creditCardType.correctness]
	},
	creditCardNumber: {
		type: String,
		required: function() {
			return this.paymentMethod == 'credit_card';
		},
		validate: [payVal.creditCardNumber.correctness]
	},
	creditCardExpireMonth: {
		type: String,
		required: function() {
			return this.paymentMethod == 'credit_card';
		},
		validate: [payVal.creditCardExpireMonth.correctness]
	},
	creditCardExpireYear: {
		type: String,
		required: function() {
			return this.paymentMethod == 'credit_card';
		},
		validate: [payVal.creditCardExpireYear.correctness]
	},
	cvv2: {
		type: String,
		required: function() {
			return this.paymentMethod == 'credit_card';
		},
		validate: [payVal.cvv2.correctness]
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
		type: r.mongoose.Schema.Types.ObjectId,
		ref: 'user',
		required: true
	}
}, { versionKey: false });



module.exports = PaymentSchema;