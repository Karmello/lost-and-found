var r = require(global.paths._requires);

module.exports = {
    categoryId: {
        correctness: {
            type: 'incorrect',
            validator: function(categoryId) {

                for (var i = 0; i < r.hardData.en.reportCategories.length; i++) {
                    if (r.hardData.en.reportCategories[i]._id == categoryId) {
                        return true;
                    }
                }

                return false;
            }
        }
    },
    subcategoryId: {
        correctness: {
            type: 'incorrect',
            validator: function (subcategoryId) {

                var i, subcategories;

                for (i = 0; i < r.hardData.en.reportCategories.length; i++) {
                    if (r.hardData.en.reportCategories[i]._id == this.categoryId) {
                        subcategories = r.hardData.en.reportCategories[i].subcategories;
                    }
                }

                if (subcategories) {

                    for (i = 0; i < subcategories.length; i++) {
                        if (subcategories[i]._id == subcategoryId) {
                            return true;
                        }
                    }

                    return false;

                } else {
                    return false;
                }
            }
        },
    },
    title: {
        length: {
            type: 'wrong_length',
            limits: {
                min: global.app.get('REPORT_TITLE_MIN_LENGTH'),
                max: global.app.get('REPORT_TITLE_MAX_LENGTH')
            },
            validator: function(title) {

                if (title.length >= global.app.get('REPORT_TITLE_MIN_LENGTH') && title.length <= global.app.get('REPORT_TITLE_MAX_LENGTH')) { return true; } else { return false; }
            }
        }
    },
    description: {
        length: {
            type: 'wrong_length',
            limits: {
                min: global.app.get('REPORT_DESCRIPTION_MIN_LENGTH'),
                max: global.app.get('REPORT_DESCRIPTION_MAX_LENGTH')
            },
            validator: function(description) {

                if (description.length >= global.app.get('REPORT_DESCRIPTION_MIN_LENGTH') && description.length <= global.app.get('REPORT_DESCRIPTION_MAX_LENGTH')) {
                    return true;

                } else { return false; }
            }
        }
    }
};