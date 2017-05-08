var r = require(global.paths._requires);

module.exports = {
    before: function(req, res, next) {

        var action = new r.prototypes.Action(arguments);

        new r.Promise(function(resolve, reject) {

            r.AppConfig.findOne({ userId: req.body.userId }, function(err, appConfig) {

                if (!err && appConfig) {

                    appConfig.update(req.body, function(err) {

                        if (!err) {

                            r.AppConfig.findOne({ userId: req.body.userId }, function(err, appConfig) {
                                if (!err) { resolve(appConfig); } else { reject(err); }
                            });

                        } else { reject(err); }
                    });

                } else { reject(err); }
            });

        }).then(function(appConfig) {

            var currentLang = req.session.language;

            req.session.theme = req.body.theme;
            req.session.language = req.body.language;

            action.end(200, {
                appConfig: appConfig,
                msg: {
                    title: r.hardData[currentLang].msgs.titles[1],
                    info: r.hardData[currentLang].msgs.infos[2],
                    reload: true
                }
            });

        }, function(err) {
            action.end(400, err);
        });
    }
};