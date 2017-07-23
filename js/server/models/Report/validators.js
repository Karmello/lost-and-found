const cm = require(global.paths.server + '/cm');

module.exports = {
	category1: {
        correctness: function(category1) {
            return Boolean(cm.libs._.find(cm.hardData.en.reportCategories, (obj) => { return obj._id == category1; }));
        }
    },
	category2: {
        correctness: function(category2) {

            let doc = this;
            if (!doc.category1) { return false; }

            let Category1 = cm.libs._.find(cm.hardData.en.reportCategories, (obj) => { return obj._id == doc.category1; });

            if (Category1) {
                return Boolean(cm.libs._.find(Category1.subcategories, (obj) => { return obj._id == category2; }));

            } else { return false; }
        }
    },
	category3: {
        correctness: function(category3) {

            let doc = this;
            if (!doc.category1 || !doc.category2) { return false; }

            let Category1 = cm.libs._.find(cm.hardData.en.reportCategories, (obj) => { return obj._id == doc.category1; });

            if (Category1) {

                let Category2 = cm.libs._.find(Category1.subcategories, (obj) => { return obj._id == doc.category2; });

                if (Category2) {
                    return Boolean(cm.libs._.find(Category2.subcategories, (obj) => { return obj._id == category3; }));

                } else { return false; }

            } else { return false; }
        }
    },
	avatar: {
        correctness: function(avatar, cb) {

            if (!this.photos || this.photos.length === 0) {
                cb(avatar === undefined);

            } else {
                cb(Boolean(cm.libs._.find(this.photos, (obj) => { return obj.filename == avatar; })));
            }
        }
    },
	photos: {
        correctness: function(photos, cb) {

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