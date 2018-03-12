const cm = require(global.paths.server + '/cm');

module.exports = (...args) => {

  let action = new cm.prototypes.Action(args);

  new cm.libs.Promise((resolve, reject) => {

    if (action.req.query.reportId) {

      cm.Report.findOne({ _id: action.req.query.reportId }, (err, report) => {

        if (!err && report) {

          cm.Comment.aggregate([
            { $match: { _id: { $in: report.comments } } },
            { $sort: { dateAdded: -1 } },
            { $skip: Number(action.req.query.skip) || 0 },
            { $limit: cm.Comment.config.get.max },
            {
              $project: {
                parentId: '$parentId',
                userId: '$userId',
                content: '$content',
                likes: '$likes',
                dateAdded: '$dateAdded',
                commentsCount: { $size: '$comments' }
              }
            }

          ], (err, comments) => {

            if (!err && comments) {

              resolve({
                meta: { count: report.comments.length },
                collection: comments
              });

            } else { reject(err); }
          });

        } else { reject(err); }
      });

    } else if (action.req.query.parentId) {

      cm.Comment.findOne({ _id: action.req.query.parentId }, (err, comment) => {

        if (!err && comment) {

          cm.Comment.aggregate([
            { $match: { _id: comment._id } },
            { $unwind: { path: '$comments', preserveNullAndEmptyArrays: true } },
            { $sort: { 'comments.dateAdded': -1 } },
            { $skip: Number(action.req.query.skip) || 0 },
            { $limit: cm.Comment.config.get.max },
            {
              $group: {
                _id: '$_id',
                comments: { $push: '$comments' }
              }
            }

          ], (err, results) => {

            if (!err && results) {

              resolve({
                meta: { count: comment.comments.length },
                collection: results[0].comments
              });

            } else { reject(err); }
          });

        } else { reject(err); }
      });

    } else { reject('NO_REPORT_OR_COMMENT_ID'); }

  }).then((data) => {

    let tasks = [];

    for (let comment of data.collection) {
      tasks.push(cm.User.findOne({ _id: comment.userId }, (err, user) => {
        if (!err && user) { comment.user = user; }
      }));
    }

    cm.libs.Promise.all(tasks).then(() => { action.end(200, data); }, (err) => { action.end(400, err); });

  }, (err) => { action.end(400, err); });
};