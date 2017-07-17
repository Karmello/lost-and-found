const r = require(global.paths.server + '/requires');
r.setup = require(global.paths.root + '/js/setup/modules/_modules');

module.exports = (req, res, next) => {

	let NODE_ENV = process.env.NODE_ENV;
	process.env.NODE_ENV = 'setup';

	require(global.paths.root + '/js/setup/tasks/' + req.query.task)(req, res, (status, body) => {

		process.env.NODE_ENV = NODE_ENV;
		res.status(status).send(body);
	});
};