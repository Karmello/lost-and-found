const cm = require(global.paths.server + '/cm');

module.exports = {
    compare: {
        type: 'incorrect',
        validator: function(currentPassword, cb) {

            cm.User.findOne({ _id: this.userId }, (err, user) => {

                if (!err && user) {

                    user.comparePasswords(currentPassword, (err, isMatch) => {
                        if (err) { cb(false); } else { cb(isMatch); }
                    });

                } else {
                    cb(false);
                }
            });
        }
    }
};