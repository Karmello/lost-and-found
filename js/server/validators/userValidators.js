var r = require(global.paths.server + '/requires');
var countries = require(global.paths.root + '/public/json/countries.json');



module.exports = {
    email: {
        correctness: {
            type: 'incorrect',
            validator: function (email) {

                var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return regex.test(email);
            }
        },
        length: {
            type: 'wrong_length',
            limits: {
                max: global.app.get('USER_EMAIL_MAX_LENGTH')
            },
            validator: function(email) {

                return email.length <= global.app.get('USER_EMAIL_MAX_LENGTH');
            }
        },
        uniqueness: {
            type: 'not_unique',
            validator: function(email, cb) {

                return r.User.findOne({ email: email }, function (err, user) {
                    cb(user === null);
                });
            }
        }
    },
    username: {
        length: {
            type: 'wrong_length',
            limits: {
                min: global.app.get('USER_USERNAME_MIN_LENGTH'),
                max: global.app.get('USER_USERNAME_MAX_LENGTH')
            },
            validator: function(username) {

                if (username.length >= global.app.get('USER_USERNAME_MIN_LENGTH') && username.length <= global.app.get('USER_USERNAME_MAX_LENGTH')) {
                    return true;

                } else {
                    return false;
                }
            }
        },
        uniqueness: {
            type: 'not_unique',
            validator: function(username, cb) {

                return r.User.findOne({ username: username }, function (err, user) {
                    cb(user === null);
                });
            }
        }
    },
    password: {
        length: {
            type: 'wrong_length',
            limits: {
                min: global.app.get('USER_PASSWORD_MIN_LENGTH'),
                max: global.app.get('USER_PASSWORD_MAX_LENGTH')
            },
            validator: function(password) {

                if (password.length >= global.app.get('USER_PASSWORD_MIN_LENGTH') && password.length <= global.app.get('USER_PASSWORD_MAX_LENGTH')) { return true; } else { return false; }
            }
        }
    },
    firstname: {
        length: {
            type: 'wrong_length',
            limits: {
                max: global.app.get('USER_FIRSTNAME_MAX_LENGTH')
            },
            validator: function(firstname) {

                if (firstname.length <= global.app.get('USER_FIRSTNAME_MAX_LENGTH')) { return true; } else { return false; }
            }
        }
    },
    lastname: {
        length: {
            type: 'wrong_length',
            limits: {
                max: global.app.get('USER_LASTNAME_MAX_LENGTH')
            },
            validator: function(lastname) {

                if (lastname.length <= global.app.get('USER_LASTNAME_MAX_LENGTH')) { return true; } else { return false; }
            }
        }
    },
    country: {
        correctness: {
            type: 'incorrect',
            validator: function(country) {

                for (var i = 0; i < countries.length; ++i) {
                    if (countries[i].name.trim() == country) {
                        return true;
                    }
                }

                return false;
            }
        }
    }
};