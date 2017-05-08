var r = require(global.paths._requires);
var glVal = r.validators.globalValidators;
var auctionVal = r.validators.auctionValidators;



var AuctionSchema = new r.mongoose.Schema({
	itemId: {
		type: r.mongoose.Schema.Types.ObjectId,
		ref: 'item',
		required: true
	},
	number: {
		type: Number
	},
	dateAdded: {
		type: Date,
		default: Date.now
	},
	currency: {
		type: String,
		validate: [auctionVal.currency.correctness],
		required: true
	},
	initialValue: {
		type: Number,
		validate: [glVal.number.is_positive, glVal.number.is_integer],
		required: true
	},
	bidIncrement: {
		type: Number,
		validate: [glVal.number.is_positive, glVal.number.is_integer],
		required: true
	},
	minSellPrice: {
		type: Number,
		validate: [glVal.number.is_positive, glVal.number.is_integer, auctionVal.minSellPrice.gtInitialValue],
		required: true
	},
	amount: {
		type: Number,
		validate: [glVal.number.is_positive, glVal.number.is_integer],
		required: true
	},
	status: {
		type: String,
		required: true,
		default: 'pending'
	},
	subscribers: [{
		type: r.mongoose.Schema.Types.ObjectId,
		ref: 'user'
	}]
}, { versionKey: false });



AuctionSchema.pre('save', function(next) {

    var doc = this;

    r.Counter.findByIdAndUpdate({_id: 'auctionId'}, { $inc: { seq: 1 } }, function(err, counter) {

		if (!err) {
			doc.number = counter.seq + 1;
			next();

		} else {
			return next(err);
		}
    });
});



module.exports = AuctionSchema;