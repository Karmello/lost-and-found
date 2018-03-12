/* eslint no-console: 0  */

const cm = require( './cm');
cm.reject = (err) => { console.error(err); return cm.libs.Promise.reject(err); };

// Paths
global.paths = { root: cm.libs.path.resolve(__dirname, './..'), server: __dirname };
global.paths.certs = global.paths.root + '/utils/https/certs';

// Creating app
cm.app = cm.libs.express();

// Getting hardcoded data
cm.hardData = {
  en: require(global.paths.root + '/public/json/hardCodedData.json').en,
  pl: require(global.paths.root + '/public/json/hardCodedData.json').pl
};

cm.init = require(global.paths.server + '/init/_init');

// Initial settings
cm.init.env().then(cm.init.app, cm.reject).then(() => {

  try {
    cm.actions = require('./models/_actions');
    cm.modules = require('./modules/_modules');
    cm.prototypes = require('./prototypes/_prototypes');
    cm.setup = require(global.paths.root + '/mockup/setup/modules/_modules');

    // Initial settings
    cm.init.consts()
      .then(cm.init.session, cm.reject)
      .then(cm.init.paypal, cm.reject)
      .then(cm.init.routes, cm.reject)
      .then(cm.init.modelRefs, cm.reject)
      .then(cm.init.db, cm.reject)
      .then(() => {

        // Creating server
        const server = cm.libs.https.createServer({
          key: cm.libs.fs.readFileSync(global.paths.certs + '/server.key'),
          cert: cm.libs.fs.readFileSync(global.paths.certs + '/server.crt'),
          passphrase: process.env.HTTPS_PASSPHRASE
        }, cm.app);

        // Init sockets
        cm.init.sockets(server).then(() => {
          server.listen(process.env.PORT, () => {
            cm.modules.utils.printFormattedLog('App server listening on port ' + process.env.PORT);
          });
        }, cm.reject);
      }, cm.reject);

  } catch(ex) { cm.reject(ex); }
}, cm.reject);

module.exports = cm;