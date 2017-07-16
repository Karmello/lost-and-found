require('./../js/server/server');

global.$server().then((r) => {

	process.env.NODE_ENV = 'testing';

	if (r) {

		require('./states/' + process.argv[2].substring(1, process.argv[2].length))(() => {
			console.log('Setup done');
		});
	}
});