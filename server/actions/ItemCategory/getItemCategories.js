var r = require(global.paths._requires);



module.exports = {
	before: function(req, res, next) {

		var other = {
			label: {
				en: 'Other',
				pl: 'Inna'
			}
		};

		r.ItemCategory.aggregate([
			{
				$unwind: '$subcategories'
			},
			{
				$project: {
					'label': '$label.' + req.session.language,
					'subcategories._id': 1,
					'subcategories.label': '$subcategories.label.' + req.session.language,
				}
			},
			{
				$sort: {
					'subcategories.label' : 1
				}
			},
			{
				$group: {
					'_id': '$_id',
					'label': {
						$first: '$label'
					},
					'subcategories': {
						$push: '$subcategories'
					}
				}
			},
			{
				$sort: {
					label : 1
				}
			}

		], function(err, itemCategories) {

			if (!err && itemCategories) {

				itemCategories.push({
					'_id': 'other',
					label: other.label[req.session.language],
					subcategories: []
				});

				for (var i in itemCategories) {
					itemCategories[i].subcategories.push({
						'_id': 'other',
						label: other.label[req.session.language]
					});
				}

				res.status(200).send(itemCategories);

			} else { res.status(500).send(); }
		});
	}
};