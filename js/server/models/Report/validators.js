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
                cb(!avatar);

            } else {
                cb(Boolean(cm.libs._.find(this.photos, (obj) => { return obj.filename == avatar; })));
            }
        }
    },
	photos: {
        correctness: function(photos, cb) {

            if (photos.length > cm.Report.config.photos.length.max) {
                cb(false);

            } else {
                let tasks = [];
                for (let photo of photos) { tasks.push(new cm.ReportPhoto(photo).validate()); }
                cm.libs.Promise.all(tasks).then(() => { cb(true); }, (err) => { cb(false); });
            }
        }
    }
};