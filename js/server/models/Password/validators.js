const cm = require(global.paths.server + '/cm');

module.exports = {
  current: {
    correctness: function(current, cb) {

      cm.User.findOne({ _id: this.userId }, (err, user) => {

        if (!err && user) {
          user.comparePasswords(current, (err, isMatch) => {
            if (err) { cb(false); } else { cb(isMatch); }
          });

        } else { cb(false); }
      });
    }
  }
};