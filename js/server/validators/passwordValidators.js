var r = require(global.paths._requires);

module.exports = {
    compare: {
        type: 'incorrect',
        validator: function(currentPassword, cb) {

            r.User.findOne({ _id: this.userId }, function(err, user) {

                if (!err && user) {

                    user.comparePasswords(currentPassword, function(err, isMatch) {
                        if (err) { cb(false); } else { cb(isMatch); }
                    });

                } else {
                    cb(false);
                }
            });
        }
    }
};