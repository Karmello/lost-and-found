const cm = require(global.paths.server + '/cm');

module.exports = (...args) => {

	let action = new cm.prototypes.Action(args);
	let tasks = [];

	tasks.push(cm.User.findOne({ _id: action.req.decoded._id }));
	tasks.push(cm.DeactivationReason.findOne({ _id: action.req.query.deactivationReasonId }));

	cm.libs.Promise.all(tasks).then((data) => {

		let user = data[0];
		let deactivationReason = data[1];

		user.remove((err) => {

			if (!err) {
				deactivationReason.count += 1;
				deactivationReason.save();
				action.end(204);

			} else { action.end(500, err); }
		});

	}, (err) => { action.end(400, err); });
};