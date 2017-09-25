const cm = require(global.paths.server + '/cm');
let modelsPath = global.paths.server + '/models';

module.exports = () => {

  return new cm.libs.Promise((resolve, reject) => {

    try {

      cm.Password = cm.libs.mongoose.model('password', require(modelsPath + '/Password/Password'));
      cm.ReportEvent = cm.libs.mongoose.model('report_event', require(modelsPath + '/ReportEvent/ReportEvent'));
      cm.ReportPhoto = cm.libs.mongoose.model('report_photo', require(modelsPath + '/ReportPhoto/ReportPhoto'));

      resolve();

    } catch (ex) { reject(ex); }
  });
};