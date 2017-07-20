const cm = require(global.paths.server + '/cm');
const countries = require(global.paths.root + '/public/json/countries.json');

module.exports = {
    email: {
        correctness: {
            type: 'incorrect',
            validator: (email) => {

                let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return regex.test(email);
            }
        },
        length: {
            type: 'wrong_length',
            limits: {
                max: cm.app.get('USER_EMAIL_MAX_LENGTH')
            },
            validator: (email) => {

                return email.length <= cm.app.get('USER_EMAIL_MAX_LENGTH');
            }
        },
        uniqueness: {
            type: 'not_unique',
            validator: (email, cb) => {

                return cm.User.findOne({ email: email }, (err, user) => {
                    cb(user === null);
                });
            }
        }
    },
    username: {
        length: {
            type: 'wrong_length',
            limits: {
                min: cm.app.get('USER_USERNAME_MIN_LENGTH'),
                max: cm.app.get('USER_USERNAME_MAX_LENGTH')
            },
            validator: (username) => {

                if (username.length >= cm.app.get('USER_USERNAME_MIN_LENGTH') && username.length <= cm.app.get('USER_USERNAME_MAX_LENGTH')) {
                    return true;

                } else {
                    return false;
                }
            }
        },
        uniqueness: {
            type: 'not_unique',
            validator: (username, cb) => {

                return cm.User.findOne({ username: username }, (err, user) => {
                    cb(user === null);
                });
            }
        }
    },
    password: {
        length: {
            type: 'wrong_length',
            limits: {
                min: cm.app.get('USER_PASSWORD_MIN_LENGTH'),
                max: cm.app.get('USER_PASSWORD_MAX_LENGTH')
            },
            validator: (password) => {

                if (password.length >= cm.app.get('USER_PASSWORD_MIN_LENGTH') && password.length <= cm.app.get('USER_PASSWORD_MAX_LENGTH')) { return true; } else { return false; }
            }
        }
    },
    firstname: {
        length: {
            type: 'wrong_length',
            limits: {
                max: cm.app.get('USER_FIRSTNAME_MAX_LENGTH')
            },
            validator: (firstname) => {

                if (firstname.length <= cm.app.get('USER_FIRSTNAME_MAX_LENGTH')) { return true; } else { return false; }
            }
        }
    },
    lastname: {
        length: {
            type: 'wrong_length',
            limits: {
                max: cm.app.get('USER_LASTNAME_MAX_LENGTH')
            },
            validator: (lastname) => {

                if (lastname.length <= cm.app.get('USER_LASTNAME_MAX_LENGTH')) { return true; } else { return false; }
            }
        }
    },
    country: {
        correctness: {
            type: 'incorrect',
            validator: (country) => {

                for (let i = 0; i < countries.length; ++i) {
                    if (countries[i].name.trim() == country) {
                        return true;
                    }
                }

                return false;
            }
        }
    }
};