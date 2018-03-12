const cm = require(global.paths.server + '/cm');
const fakeDataPath = global.paths.root + '/resources/mockup';

module.exports = {
  prepare: (users) => {

    switch (cm.setup.subject) {

      case 'User': {

        return new cm.libs.Promise((resolve) => {

          cm.libs.fs.readdir(fakeDataPath, (err, ids) => {

            let data = [];

            for (let id of ids) {

              let config = require(fakeDataPath + '/' + id + '/config');

              data.push({
                _id: id,
                email: config.firstname.toLowerCase() + config.lastname.toLowerCase() + '@gmail.com',
                username: config.firstname + config.lastname,
                password: 'password',
                firstname: config.firstname,
                lastname: config.lastname,
                country: config.country,
                avatarPath: fakeDataPath + '/' + id + '/avatar.jpg',
                config: {
                  language: 'en',
                  theme: 'standard'
                }
              });
            }

            resolve(data);
          });
        });
      }

      case 'Report': {

        let tasks = [];

        for (let user of users) {

          let reportsPath = fakeDataPath + '/' + user._id + '/reports';
          let reportIds = [];

          if (cm.libs.fs.existsSync(reportsPath)) {

            reportIds = cm.libs.fs.readdirSync(reportsPath);

            for (let reportId of reportIds) {
              tasks.push(new cm.libs.Promise((resolve) => {
                let config = require(reportsPath + '/' + reportId + '/config');
                config._id = reportId;
                config.userId = user._id;
                resolve(config);
              }));
            }
          }
        }

        return cm.libs.Promise.all(tasks);
      }

      case 'Comment':

        return new cm.libs.Promise((resolve) => {

          let comments = require(global.paths.root + '/mockup/setup/hardcoded/comments');
          let data = [];

          let startDate = new Date(2017, 0, 1);
          let endDate = new Date();

          for (let i = 0; i < 7; i++) {

            data.push({
              parentId: '000000000000000000000005',
              userId: users[Math.floor(Math.random() * (users.length - 1))]._id,
              content: comments[Math.floor(Math.random() * (comments.length - 1))],
              dateAdded: new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()))
            });
          }

          resolve(data);
        });
    }
  }
};