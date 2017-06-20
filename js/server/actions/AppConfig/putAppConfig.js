var r = require(global.paths._requires);

module.exports = {
    before: function(req, res, next) {

        var action = new r.prototypes.Action(arguments);

        new r.Promise(function(resolve, reject) {

            r.AppConfig.findOne({ _id: req.params.id }, function(err, appConfig) {

                if (!err && appConfig) {

                    appConfig.language = req.body.language;
                    appConfig.theme = req.body.theme;

                    appConfig.save(function(err) {

                        if (!err) {

                            req.session.theme = appConfig.theme;
                            req.session.language = appConfig.language;

                            resolve();

                        } else { reject(err); }
                    });

                } else { reject(err); }
            });

        }).then(function() {

            action.end(200, {
                msg: {
                    title: r.hardData[req.session.language].msgs.titles[1],
                    info: r.hardData[req.session.language].msgs.infos[2],
                    reload: true
                }
            });

        }, function(err) {
            action.end(400, err);
        });
    }
};