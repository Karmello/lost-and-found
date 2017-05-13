var r = require(global.paths._requires);

module.exports = new r.mongoose.Schema({
	_id: {
		type: String,
		required: true
	},
	label: {
		type: Object,
		required: true
	},
	subcategories: [r.mongoose.Schema({
		_id: {
			type: String,
			required: true
		},
		categoryId: {
			type: String,
			ref: 'report_category',
			required: true
		},
		label: {
			type: Object,
			required: true
		}
	}, { versionKey: false })]
}, { versionKey: false });