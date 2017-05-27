var r = require(global.paths._requires);

module.exports = function(req, res, next) {

    var action = new r.prototypes.Action(arguments);

    r.User.findOne({ email: req.decoded.email }, '-email -username', function(err, user) {

        if (!err && user) {

            user.password = Math.random().toString(36).slice(-8);

            var mail = r.modules.mailModule.create('new_pass', req.session.language, req.decoded.email, {
                username: req.decoded.username,
                password: user.password
            });

            r.modules.mailModule.send(mail, function(err, info) {

                if (!err) {

                    user.save(function(err) {

                        if (!err) {
                            res.redirect('/#/start/login?action=pass_reset');

                        } else { res.redirect('/'); }
                    });

                } else { res.status(500).send('COULD_NOT_SEND_EMAIL'); }
            });

        } else { res.redirect('/'); }
    });
};