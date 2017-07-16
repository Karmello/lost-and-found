const r = require(global.paths.server + '/requires');
r.tasks = require(global.paths.root + '/js/setup/tasks/_tasks');

process.env.NODE_ENV = 'setup';

module.exports = (req, res, next) => {

	require(global.paths.root + '/js/setup/' + req.query.task)(req, res, next);
};