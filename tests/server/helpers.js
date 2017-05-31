var mongoose = require('mongoose');

(function() {

    var helpers = {
        getReqObj: function() {

            return {
                session: {
                    badActionsCount: { login: 0, register: 0, recover: 0, max: Number(global.app.get('CAPTCHA_MAX_BAD_ACTIONS')) },
                    language: global.app.get('DEFAULT_LANG'),
                    theme: global.app.get('DEFAULT_THEME')
                },
                decoded: {
                    _doc: {
                        _id: undefined,
                        email: undefined
                    }
                },
                params: { id: undefined },
                query: { action: undefined },
                body: {
                    model: {}
                },
                headers: {}
            };
        },
        createString: function(length) {

            var string = '';
            for (var i = 0; i < length; i++) { string += 'a'; }
            return string;
        },
    	users: {
            undefinedUser: {
                email: undefined,
                username: undefined,
                password: undefined,
                firstname: undefined,
                lastname: undefined,
                country: undefined
            },
            emptyUser: {
                email: '',
                username: '',
                password: '',
                firstname: '',
                lastname: '',
                country: ''
            },
            spaceUser: {
                email: '     ',
                username: '     ',
                password: '     ',
                firstname: '     ',
                lastname: '     ',
                country: '     '
            },
    		user1: {
				email: 'nogakamil@vp.pl',
				username: 'Karmello',
				password: 'password',
				firstname: 'Kamil',
				lastname: 'Noga',
				country: 'Poland'
			},
            user2: {
                email: 'P605@poczta.onet.pl',
                username: 'Andy',
                password: 'password',
                firstname: 'Andrzej',
                lastname: 'Noga',
                country: 'United States'
            }
    	},
        reports: {
            undefinedReport: {
                category1: undefined,
                category2: undefined,
                title: undefined,
                description: undefined,
                currency: undefined,
                initialValue: undefined,
                bidIncrement: undefined,
                minSellPrice: undefined,
                amount: undefined
            },
            emptyReport: {
                category1: '',
                category2: '',
                title: '',
                description: '',
                currency: '',
                initialValue: '',
                bidIncrement: '',
                minSellPrice: '',
                amount: ''
            },
            spaceReport: {
                category1: '     ',
                category2: '     ',
                title: '     ',
                description: '     ',
                currency: '     ',
                initialValue: '     ',
                bidIncrement: '     ',
                minSellPrice: '     ',
                amount: '     '
            },
            report1: {
                category1: 'electronics',
                category2: 'smartphones',
                title: 'Sony Xperia S smartphoneeeeeeeeee',
                description: 'This is Sony Xperia S smartphone This is Sony Xperia S smartphone This is Sony Xperia S smartphone This is Sony Xperia S smartphone This is Sony Xperia S smartphone This is Sony Xperia S smartphone This is Sony Xperia S smartphone This is Sony Xperia S smartphone This is Sony Xperia S smartphone This is Sony Xperia S smartphone This is Sony Xperia S smartphone',
                currency: 'USD',
                initialValue: 30,
                bidIncrement: 5,
                minSellPrice: 100,
                amount: 1
            }
        },
    	all: {
    		delete: function(modelName, cb) {

    			var Model = mongoose.model(modelName);

    			Model.find({}, function(err, docs) {

    				if (docs) {

    					docs.forEach(function(doc) {
    						doc.remove();
    					});
    				}

    				if (cb) { cb(); }
    			});
    		}
    	},
        clearDb: function(cb) {

            helpers.all.delete('user', function() {
                helpers.all.delete('app_config', function() {
                    cb();
                });
            });
        }
    };

	module.exports = helpers;

})();