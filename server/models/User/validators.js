const cm = require(global.paths.server + '/cm');
const countries = require(global.paths.root + '/public/json/countries.json');

module.exports = {
  email: {
    correctness: function(email) {
      let regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return regex.test(email);
    },
    uniqueness: function(email, cb) {
      return cm.User.findOne({ email: email }, (err, user) => { cb(user === null); });
    }
  },
  username: {
    uniqueness: function(username, cb) {
      return cm.User.findOne({ username: username }, (err, user) => { cb(user === null); });
    }
  },
  country: {
    correctness: function(country) {
      for (let i = 0; i < countries.length; ++i) { if (countries[i].name.trim() === country) { return true; } }
      return false;
    }
  },
  configLanguage: {
    correctness: function(language) {
      return Boolean(cm.libs._.find(cm.hardData.en.languages, { value: language }));
    }
  },
  configTheme: {
    correctness: function(theme) {
      return Boolean(cm.libs._.find(cm.hardData.en.themes, { value: theme }));
    }
  }
};