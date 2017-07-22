const cm = require(global.paths.server + '/cm');

module.exports = {
	save: (doc) => {

		// Top level comment
		if (doc.comments) {

			// Updating report
			cm.Report.findOneAndUpdate({ _id: doc.parentId }, { $addToSet: { comments: doc._id } }, function(err) {
				if (err) { console.error(err); }
			});

			cm.io.sockets.in('report/' + doc.parentId).emit('newComment', 'doc.content');
		}
	},
	remove: (doc) => {

		// Top level comment
		if (doc.comments) {

			// Updating report
			cm.Report.findOneAndUpdate({ _id: doc.parentId }, { $pull: { comments: doc._id } }, function(err) {
				if (err) { console.error(err); }
			});
		}
	}
};