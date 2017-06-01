var r = require(global.paths._requires);

module.exports = {
    group: {
        correctness: {
            type: 'incorrect',
            validator: function(group) {

                for (var i = 0; i < r.hardData.en.reportGroups.length; i++) {
                    if (r.hardData.en.reportGroups[0].value == group) {
                        return true;
                    }
                }

                return false;
            }
        }
    },
    details: {
        length: {
            type: 'wrong_length',
            limits: {
                min: global.app.get('REPORT_EVENT_DETAILS_MIN_LENGTH'),
                max: global.app.get('REPORT_EVENT_DETAILS_MAX_LENGTH')
            },
            validator: function(details) {

                if (details.length >= global.app.get('REPORT_EVENT_DETAILS_MIN_LENGTH') && details.length <= global.app.get('REPORT_EVENT_DETAILS_MAX_LENGTH')) {
                    return true;

                } else { return false; }
            }
        }
    }
};