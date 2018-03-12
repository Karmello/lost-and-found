const cm = require(global.paths.server + '/cm');

module.exports = (report) => {

  return new cm.libs.Promise((resolve, reject) => {

    report.validate((err1) => {
      report.startEvent.validate((err2) => {

        if (!err1 && !err2) {
          resolve();

        } else {

          let err = { name: 'ValidationError', errors: {} };

          if (err1) {
            Object.assign(err.errors, err1.errors);
          }

          if (err2) {
            err.errors.startEvent = {};
            Object.assign(err.errors.startEvent, err2.errors);
          }

          reject(err);
        }
      });
    });
  });
};