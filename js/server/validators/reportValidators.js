const cm = require(global.paths.server + '/cm');

module.exports = {
    category1: {
        correctness: {
            type: 'incorrect',
            validator: (category1) => {

                return Boolean(cm.libs._.find(cm.hardData.en.reportCategories, (obj) => {
                    return obj._id == category1;
                }));
            }
        }
    },
    category2: {
        correctness: {
            type: 'incorrect',
            validator: function(category2) {

                let doc = this;

                if (!doc.category1) { return false; }

                var category1 = cm.libs._.find(cm.hardData.en.reportCategories, (obj) => {
                    return obj._id == doc.category1;
                });

                if (category1) {

                    return Boolean(cm.libs._.find(category1.subcategories, (obj) => {
                        return obj._id == category2;
                    }));

                } else { return false; }
            }
        }
    },
    category3: {
        correctness: {
            type: 'incorrect',
            validator: function(category3) {

                let doc = this;

                if (!doc.category1 || !doc.category2) { return false; }

                var category1 = cm.libs._.find(cm.hardData.en.reportCategories, (obj) => {
                    return obj._id == doc.category1;
                });

                if (category1) {

                    var category2 = cm.libs._.find(category1.subcategories, (obj) => {
                        return obj._id == doc.category2;
                    });

                    if (category2) {

                        return Boolean(cm.libs._.find(category2.subcategories, (obj) => {
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
                min: cm.app.get('REPORT_TITLE_MIN_LENGTH'),
                max: cm.app.get('REPORT_TITLE_MAX_LENGTH')
            },
            validator: (title) => {

                if (title.length >= cm.app.get('REPORT_TITLE_MIN_LENGTH') && title.length <= cm.app.get('REPORT_TITLE_MAX_LENGTH')) { return true; } else { return false; }
            }
        }
    },
    description: {
        length: {
            type: 'wrong_length',
            limits: {
                min: cm.app.get('REPORT_DESCRIPTION_MIN_LENGTH'),
                max: cm.app.get('REPORT_DESCRIPTION_MAX_LENGTH')
            },
            validator: (description) => {

                if (description.length >= cm.app.get('REPORT_DESCRIPTION_MIN_LENGTH') && description.length <= cm.app.get('REPORT_DESCRIPTION_MAX_LENGTH')) {
                    return true;

                } else { return false; }
            }
        }
    },
    avatar: {
        correctness: {
            type: 'incorrect',
            validator: function(avatar, cb) {

                if (!this.photos || this.photos.length === 0) {
                    cb(avatar === undefined);

                } else {
                    cb(Boolean(cm.libs._.find(this.photos, (obj) => { return obj.filename == avatar; })));
                }
            }
        }
    },
    photos: {
        type: 'incorrect',
        validator: (photos, cb) => {

            let getSinglePromise = (i) => {

                return new cm.libs.Promise((resolve) => {
                    new cm.ReportPhoto(photos[i]).validate((err) => { resolve(err); });
                });
            };

            let promises = [];
            for (let i = 0; i < photos.length; i++) { promises.push(getSinglePromise(i)); }

            cm.libs.Promise.all(promises).then((results) => {
                cb(!Boolean(cm.libs._.find(results, (elem) => { return elem; })));
            });
        }
    }
};