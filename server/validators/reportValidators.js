var r = require(global.paths._requires);

module.exports = {
    category1: {
        correctness: {
            type: 'incorrect',
            validator: function(category1) {

                return Boolean(r._.find(r.hardData.en.reportCategories, function(obj) {
                    return obj._id == category1;
                }));
            }
        }
    },
    category2: {
        correctness: {
            type: 'incorrect',
            validator: function (category2) {

                var doc = this;

                if (!doc.category1) { return false; }

                var category1 = r._.find(r.hardData.en.reportCategories, function(obj) {
                    return obj._id == doc.category1;
                });

                if (category1) {

                    return Boolean(r._.find(category1.subcategories, function(obj) {
                        return obj._id == category2;
                    }));

                } else { return false; }
            }
        }
    },
    category3: {
        correctness: {
            type: 'incorrect',
            validator: function (category3) {

                var doc = this;

                if (!doc.category1 || !doc.category2) { return false; }

                var category1 = r._.find(r.hardData.en.reportCategories, function(obj) {
                    return obj._id == doc.category1;
                });

                if (category1) {

                    var category2 = r._.find(category1.subcategories, function(obj) {
                        return obj._id == doc.category2;
                    });

                    if (category2) {

                        return Boolean(r._.find(category2.subcategories, function(obj) {
                            return obj._id == category3;
                        }));

                    } else { return false; }

                } else { return false; }
            }
        }
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