global.paths = {
	_requires: __dirname + '/server/_requires',
	server: __dirname + '/server/',
	schemas: __dirname + '/server/schemas/',
	validators: __dirname + '/server/validators/_validators',
	controllers: __dirname + '/server/controllers/',
	prototypes: __dirname + '/server/prototypes/_prototypes',
	setups: __dirname + '/server/setups/_setups',
	modules: __dirname + '/server/modules/_modules',
	actions: __dirname + '/server/actions/_actions',
	guards: __dirname + '/server/guards/_guards',
	public: __dirname + '/public/',
	json: __dirname + '/public/json/',
	tests: __dirname + '/tests/'
};

var r = require(global.paths._requires);

if (!process.env.LOADED_MOCHA_OPTS) {
	require('dotenv').config();

} else {
	require('dotenv').config({ path: global.paths.tests + '/server/.env' });
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



r.hardData = {
	en: require(global.paths.json + '/hard_coded/hard_coded_en.json'),
	pl: require(global.paths.json + '/hard_coded/hard_coded_pl.json')
};

r.setups = require(global.paths.setups);
r.modules = require(global.paths.modules);
r.prototypes = require(global.paths.prototypes);
r.actions = require(global.paths.actions);

r.setups.setupConstants(app, function() {
	r.setups.setupSession(app, function() {

		r.validators = require(global.paths.validators);

		r.setups.setupRoutes(app, __dirname, function() {
			r.setups.setupDb(function() {

				r.AppConfig = r.mongoose.model('app_config');
				r.User = r.mongoose.model('user');
				r.Password = r.mongoose.model('password');
				r.ReportCategory = r.mongoose.model('report_category');
				r.Report = r.mongoose.model('report');
				r.DeactivationReason = r.mongoose.model('deactivation_reason');
				r.ContactType = r.mongoose.model('contact_type');
				r.Counter = r.mongoose.model('counter');
				r.Comment = r.mongoose.model('comment');

				var server = r.http.createServer(app);

				r.setups.setupSockets(server, function() {
					server.listen(process.env.PORT, function () {

				    	var log = 'App server listening on port ' + process.env.PORT;
				        r.modules.utilModule.printFormattedLog(log);
				    });
				});
			});
		});
	});
});