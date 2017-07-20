const cm = require(global.paths.server + '/cm');

module.exports = {
	validateReportAction: (req, res, next) => {

        switch (req.method) {

            case 'PUT':

                if (req.body.userId != req.decoded._id) {
                    return res.status(401).send('REPORT_' + req.method + '_NOT_ALLOWED');
                }

                break;
        }

        next();
    },
    emitReportsCount: (type) => {

        let tasks = [];
        tasks.push(cm.Report.count({}), cm.Report.count({ 'startEvent.type': type }));

        cm.libs.Promise.all(tasks).then((results) => {
            let data = { reportsCount: results[0] };
            data[type + 'ReportsCount'] = results[1];
            cm.io.emit('UpdateAppStats', data);
        });
    }
};