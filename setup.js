const users = require('./js/server/mockupData/users');
let done = () => console.log('Setup done');

require('./js/server/server');

global.$server().then((r) => {

	if (r) {

		switch(process.argv[2]) {

			case '-0':

				r.User.remove({}, () => {
					r.AppConfig.remove(() => {
						done();
					});
				});

				break;

			case '-1':

				r.User.remove({}, () => {
					r.AppConfig.remove(() => {

						for (var user of users) {

							r.actions.user.post.register({
								query: { action: 'register' },
								body: user,
								session: {
									language: 'en',
									theme: 'standard',
									badActionsCount: { register: 0, max: 5 }
								}
							});
						}

						done();
					});
				});

				break;
		}
	}
});