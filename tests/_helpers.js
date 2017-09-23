module.exports = {
	getReqObj: () => {

		return {
			headers: {},
			query: {},
			body: {},
			decoded: {},
			session: {
				language: 'en',
				theme: 'standard',
				badActionsCount: {
					login: 0,
					register: 0,
					recover: 0,
					max: 5
				}
			}
		};
	}
};