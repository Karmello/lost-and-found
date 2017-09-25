const cm = require(global.paths.server + '/cm');

module.exports = () => {

  return new cm.libs.Promise((resolve, reject) => {

    try {

      if (!process.env.LOADED_MOCHA_OPTS) {
        require('dotenv').config();

      } else {
        require('dotenv').config({ path: global.paths.root + '/tests/.env' });
      }

      resolve();

    } catch(ex) { reject(ex); }
  });
};