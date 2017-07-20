const cm = require( './cm');
cm.reject = (err) => { console.error(err); return cm.libs.Promise.reject(err); };

global.paths = { root: cm.libs.path.resolve(__dirname, './../..'), server: __dirname };
global.paths.certs = global.paths.root + '/utils/https/certs';

cm.app = cm.libs.express();

cm.hardData = {
	en: require(global.paths.root + '/public/json/hardCodedData.json').en,
	pl: require(global.paths.root + '/public/json/hardCodedData.json').pl
};

cm.init = require('./init/_init');

cm.init.env().then(cm.init.app, cm.reject).then(() => {

	try {

		cm.actions = require('./actions/_actions');
		cm.modules = require('./modules/_modules');
		cm.prototypes = require('./prototypes/_prototypes');

		cm.init.consts().then(cm.init.session).then(cm.init.paypal).then(() => {

			try {

				cm.validators = require('./validators/_validators');

				cm.init.routes().then(cm.init.db, cm.reject).then(cm.init.modelRefs, cm.reject).then(() => {

					const server = cm.libs.https.createServer({
						key: cm.libs.fs.readFileSync(global.paths.certs + '/server.key'),
						cert: cm.libs.fs.readFileSync(global.paths.certs + '/server.crt'),
						passphrase: process.env.HTTPS_PASSPHRASE
					}, cm.app);

					cm.init.sockets(server).then(() => {

						server.listen(process.env.PORT, () => {
					        cm.modules.utilModule.printFormattedLog('App server listening on port ' + process.env.PORT);
					    });

					}, cm.reject);
				}, cm.reject);

			} catch (ex) { cm.reject(ex); }
		});

	} catch (ex) { cm.reject(ex); }
}, cm.reject);

module.exports = cm;