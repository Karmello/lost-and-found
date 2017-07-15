const r = require(global.paths.server + '/requires');

const m = {
	getNewReq: () => {

		return {
			query: { action: '' },
			body: undefined,
			decoded: { _id: undefined },
			session: {
				language: 'en',
				theme: 'standard',
				badActionsCount: { login: 0, register: 0, recover: 0, max: 5 }
			}
		};
	}
};

module.exports = m;