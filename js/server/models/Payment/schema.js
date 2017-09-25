const cm = require(global.paths.server + '/cm');

module.exports = new cm.libs.mongoose.Schema({
  paymentId: {
    type: String
  },
  userId: {
    type: cm.libs.mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  method: {
    type: String,
    required: true,
    validate: [cm.modules.validator.get('Payment', 'method', 'correctness')]
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
  creditCard: {
    type: {
      type: String,
      required: function() {
        return this.method == 'credit_card';
      },
      validate: [cm.modules.validator.get('Payment', 'creditCardType', 'correctness')]
    },
    number: {
      type: String,
      required: function() {
        return this.method == 'credit_card';
      },
      validate: [cm.modules.validator.get('Payment', 'creditCardNumber', 'correctness')]
    },
    expireMonth: {
      type: String,
      required: function() {
        return this.method == 'credit_card';
      },
      validate: [cm.modules.validator.get('Payment', 'creditCardExpireMonth', 'correctness')]
    },
    expireYear: {
      type: String,
      required: function() {
        return this.method == 'credit_card';
      },
      validate: [cm.modules.validator.get('Payment', 'creditCardExpireYear', 'correctness')]
    },
    cvv2: {
      type: String,
      required: function() {
        return this.method == 'credit_card';
      },
      validate: [cm.modules.validator.get('Payment', 'cvv2', 'correctness')]
    },
    name: {
      first: {
        type: String,
        required: function() {
          return this.method == 'credit_card';
        },
      },
      last: {
        type: String,
        required: function() {
          return this.method == 'credit_card';
        }
      }
    }
  }
}, { versionKey: false });