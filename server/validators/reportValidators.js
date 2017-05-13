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

                    return r.ReportCategory.findOne({ _id: categoryId }, function(err, reportCategory) {
                        cb(Boolean(reportCategory));
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

                    return r.ReportCategory.findOne({ _id: this.categoryId }, function(err, reportCategory) {

                        if (!err && reportCategory) {

                            var subCategory = reportCategory.subcategories.filter(function(child) {
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
                return global.app.get('REPORT_TITLE_MIN_LENGTH') + '-' + global.app.get('REPORT_TITLE_MAX_LENGTH');
            },
            validator: function(title) {

                if (title.length >= global.app.get('REPORT_TITLE_MIN_LENGTH') && title.length <= global.app.get('REPORT_TITLE_MAX_LENGTH')) { return true; } else { return false; }
            }
        }
    },
    description: {
        length: {
            type: 'wrong_length',
            msgIndex: 14,
            getIntervalMsg: function() {
                return global.app.get('REPORT_DESCRIPTION_MIN_LENGTH') + '-' + global.app.get('REPORT_DESCRIPTION_MAX_LENGTH');
            },
            validator: function(description) {

                if (description.length >= global.app.get('REPORT_DESCRIPTION_MIN_LENGTH') && description.length <= global.app.get('REPORT_DESCRIPTION_MAX_LENGTH')) {
                    return true;

                } else { return false; }
            }
        }
    }
};