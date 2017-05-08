var r = require(global.paths._requires);

module.exports = {
    categoryId: {
        correctness: {
            type: 'incorrect',
            msgIndex: 2,
            validator: function(categoryId, cb) {

                if (categoryId == 'other') {
                    cb(true);

                } else {

                    return r.ItemCategory.findOne({ _id: categoryId }, function(err, itemCategory) {
                        cb(Boolean(itemCategory));
                    });
                }
            }
        }
    },
    subcategoryId: {
        correctness: {
            type: 'incorrect',
            msgIndex: 2,
            validator: function (subcategoryId, cb) {

                if (subcategoryId == 'other') {
                    cb(true);

                } else {

                    return r.ItemCategory.findOne({ _id: this.categoryId }, function(err, itemCategory) {

                        if (!err && itemCategory) {

                            var subCategory = itemCategory.subcategories.filter(function(child) {
                                return child._id === subcategoryId;
                            }).pop();

                            cb(Boolean(subCategory));

                        } else { cb(false); }
                    });
                }
            }
        },
    },
    title: {
        length: {
            type: 'wrong_length',
            msgIndex: 14,
            getIntervalMsg: function() {
                return global.app.get('ITEM_TITLE_MIN_LENGTH') + '-' + global.app.get('ITEM_TITLE_MAX_LENGTH');
            },
            validator: function(title) {

                if (title.length >= global.app.get('ITEM_TITLE_MIN_LENGTH') && title.length <= global.app.get('ITEM_TITLE_MAX_LENGTH')) { return true; } else { return false; }
            }
        }
    },
    description: {
        length: {
            type: 'wrong_length',
            msgIndex: 14,
            getIntervalMsg: function() {
                return global.app.get('ITEM_DESCRIPTION_MIN_LENGTH') + '-' + global.app.get('ITEM_DESCRIPTION_MAX_LENGTH');
            },
            validator: function(description) {

                if (description.length >= global.app.get('ITEM_DESCRIPTION_MIN_LENGTH') && description.length <= global.app.get('ITEM_DESCRIPTION_MAX_LENGTH')) {
                    return true;

                } else { return false; }
            }
        }
    }
};