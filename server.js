global.paths = {
	_requires: __dirname + '/js/server/_requires',
	server: __dirname + '/js/server/',
	schemas: __dirname + '/js/server/schemas/',
	validators: __dirname + '/js/server/validators/_validators',
	controllers: __dirname + '/js/server/controllers/',
	prototypes: __dirname + '/js/server/prototypes/_prototypes',
	setups: __dirname + '/js/server/setups/_setups',
	modules: __dirname + '/js/server/modules/_modules',
	actions: __dirname + '/js/server/actions/_actions',
	guards: __dirname + '/js/server/guards/_guards',
	public: __dirname + '/public/',
	json: __dirname + '/public/json/',
	tests: __dirname + '/tests/'
};

var r = require(global.paths._requires);

if (!process.env.LOADED_MOCHA_OPTS) {
	require('dotenv').config();

} else {
	require('dotenv').config({ path: global.paths.tests + '/js/server/.env' });
}



var app = r.express();
global.app = app;

app.use(r.morgan('dev'));
app.use(r.bodyParser.urlencoded({ extended: true }));
app.use(r.bodyParser.json());
app.use(r.methodOverride('X-HTTP-Method-Override'));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

var hardCodedData = require(global.paths.json + '/hardCodedData.json');
r.hardData = { en: hardCodedData.en, pl: hardCodedData.pl };

r.setups = require(global.paths.setups);
r.modules = require(global.paths.modules);
r.prototypes = require(global.paths.prototypes);
r.actions = require(global.paths.actions);

r.setups.setupConstants(app, function() {
	r.setups.setupSession(app, function() {
		r.setups.setupPaypal(function() {

			r.validators = require(global.paths.validators);

			r.setups.setupRoutes(app, __dirname, function() {
				r.setups.setupDb(function() {

					r.AppConfig = r.mongoose.model('app_config');
					r.Comment = r.mongoose.model('comment');
					r.ContactType = r.mongoose.model('contact_type');
					r.Counter = r.mongoose.model('counter');
					r.DeactivationReason = r.mongoose.model('deactivation_reason');
					r.Password = r.mongoose.model('password');
					r.Payment = r.mongoose.model('payment');
					r.Report = r.mongoose.model('report');
					r.ReportEvent = r.mongoose.model('report_event', require(global.paths.schemas + 'ReportEventSchema'));
					r.ReportPhoto = r.mongoose.model('report_photo', require(global.paths.schemas + 'ReportPhotoSchema'));
					r.User = r.mongoose.model('user');

					var server = r.https.createServer({
						key: r.fs.readFileSync('utils/https/certs/server.key'),
    					cert: r.fs.readFileSync('utils/https/certs/server.crt'),
    					passphrase: process.env.HTTPS_PASSPHRASE
					}, app);

					r.io = r.socketIO(server);

					server.listen(process.env.PORT, function () {
				    	var log = 'App server listening on port ' + process.env.PORT;
				        r.modules.utilModule.printFormattedLog(log);
				    });
				});
			});
		});
	});
});