const cm = require(global.paths.server + '/cm');

module.exports = {
  readImgs: (data) => {

    let tasks = [];

    switch (cm.setup.subject) {

      case 'User': {

        for (let config of data) {

          tasks.push(new cm.libs.Promise((resolve, reject) => {
            cm.libs.fs.readFile(config.avatarPath, (err, fileData) => {

              if (!err) {
                resolve({
                  userId: config._id,
                  fileType: 'image/' + config.avatarPath.substring(config.avatarPath.lastIndexOf('.') + 1, config.avatarPath.length),
                  fileData: fileData
                });

              } else { reject(err); }
            });
          }));
        }

        break;
      }

      case 'Report': {

        let fakeDataPath = global.paths.root + '/resources/fake-data';
        let userIds = cm.libs.fs.readdirSync(fakeDataPath);

        for (let userId of userIds) {

          let reportsPath = fakeDataPath + '/' + userId + '/reports';

          if (cm.libs.fs.existsSync(reportsPath)) {

            let reportIds = cm.libs.fs.readdirSync(reportsPath);

            for (let reportId of reportIds) {

              let imgsFolderPath = fakeDataPath + '/' + userId + '/reports/' + reportId + '/imgs';
              let imgNames = cm.libs.fs.readdirSync(imgsFolderPath);

              for (let imgName of imgNames) {

                tasks.push(new cm.libs.Promise((resolve, reject) => {

                  let imgPath = imgsFolderPath + '/' + imgName;

                  cm.libs.fs.readFile(imgPath, (err, fileData) => {

                    if (!err) {
                      resolve({
                        userId: userId,
                        reportId: reportId,
                        fileType: 'image/' + imgPath.substring(imgPath.lastIndexOf('.') + 1, imgPath.length),
                        fileData: fileData
                      });

                    } else { reject(err); }
                  });
                }));
              }
            }
          }
        }

        break;
      }
    }

    return cm.libs.Promise.all(tasks);
  }
};