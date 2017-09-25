const cm = require(global.paths.server + '/cm');

module.exports = {
  remove: (doc) => {

    cm.User.emitUsersCount();
    doc.removeAvatarFromS3();

    cm.Report.find({ userId: doc._id }, (err, reports) => {
      if (!err) { for (let report of reports) { report.remove(); } } else { console.error(err); }
    });
  }
};