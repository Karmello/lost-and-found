const cm = require(global.paths.server + '/cm');

module.exports = {
  remove: (doc) => {

    cm.Report.emitReportsCount(doc.startEvent.type);
    doc.removePhotosFromS3();

    cm.Comment.find({ _id: { $in: doc.comments } }, (err, comments) => {
      if (!err) { for (let comment of comments) { comment.remove(); } } else { console.error(err); }
    });

    cm.User.update({ reportsRecentlyViewed: doc._id }, { $pull: { reportsRecentlyViewed: doc._id } }, { multi: true }, (err) => {
      if (err) { console.error(err); }
    });
  }
};