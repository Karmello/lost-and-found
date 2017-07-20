const cm = require(global.paths.server + '/cm');
let schemasPath = global.paths.server + '/schemas';

module.exports = () => {

	return new cm.libs.Promise((resolve, reject) => {

		try {

			cm.Password = cm.libs.mongoose.model('password', require(schemasPath + '/Password/Password'));
			cm.ReportEvent = cm.libs.mongoose.model('report_event', require(schemasPath + '/ReportEvent/ReportEvent'));
			cm.ReportPhoto = cm.libs.mongoose.model('report_photo', require(schemasPath + '/ReportPhoto/ReportPhoto'));

			resolve();

		} catch (ex) { reject(ex); }
	});
};