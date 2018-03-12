/* eslint no-unused-vars: 0 */

const getFreshSession = () => {
  return {
    language: 'en',
    theme: 'standard',
    badActionsCount: { login: 0, register: 0, recover: 0, max: 5 }
  };
};

const getFreshRequest = () => {
  return {
    headers: {},
    query: {},
    body: {},
    decoded: {},
    session: getFreshSession()
  };
};