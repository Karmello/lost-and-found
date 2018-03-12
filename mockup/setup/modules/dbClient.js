const cm = require(global.paths.server + '/cm');

module.exports = {
  get: () => {

    return new cm.libs.Promise((resolve, reject) => {

      if (cm.setup.subject !== 'User') {
        cm.User.find({}, (err, users) => {
          if (!err) { resolve(users); } else { reject(err); }
        });

      } else { resolve(); }
    });
  },
  create: (data) => {

    return new cm.libs.Promise((resolve, reject) => {

      let tasks = [];

      let nameFields = {
        User: 'username',
        Report: 'title',
        Comment: 'content'
      };

      for (let config of data) {

        tasks.push(new cm[cm.setup.subject](config).save((err) => {

          if (!err) {
            console.log('"' + config[nameFields[cm.setup.subject]] + '" saved');

          } else {
            console.error(err);
          }
        }));
      }

      cm.libs.Promise.all(tasks).then(() => { resolve(data); }, reject);
    });
  },
  sync: (files) => {

    return new cm.libs.Promise((resolve, reject) => {

      let tasks = [];

      switch (cm.setup.subject) {

        case 'User': {

          for (let file of files) {
            tasks.push(new cm.libs.Promise((resolve, reject) => {
              cm.User.findOne({ _id: file.userId }, (err, user) => {
                if (!err) { user.update({ photos: [{ filename: file.filename, size: 100 }] }, () => { resolve(); }); } else { reject(err); }
              });
            }));
          }

          break;
        }

        case 'Report': {

          let data = {};

          for (let file of files) {

            if (!data[file.reportId]) {
              data[file.reportId] = [{ filename: file.filename, size: 100 }];

            } else {
              data[file.reportId].push({ filename: file.filename, size: 100 });
            }
          }

          for (let reportId in data) {
            tasks.push(new cm.libs.Promise((resolve, reject) => {
              cm.Report.findOne({ _id: reportId }, (err, report) => {

                if (!err) {
                  report.update({ avatar: data[reportId][0].filename, photos: data[reportId] }, () => { resolve(); });

                } else { reject(err); }
              });
            }));
          }

          break;
        }
      }

      cm.libs.Promise.all(tasks).then(() => { resolve(); }, reject);
    });
  }
};