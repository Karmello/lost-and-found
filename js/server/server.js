const r = require( './requires');

global.paths = {
	root: r.path.resolve(__dirname, './../..'),
	server: __dirname
};

if (!process.env.LOADED_MOCHA_OPTS) { require('dotenv').config(); } else { require('dotenv').config({ path: global.paths.root + '/tests/end-to-end/.env' }); }



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

var hardCodedData = require(global.paths.root + '/public/json/hardCodedData.json');
r.hardData = { en: hardCodedData.en, pl: hardCodedData.pl };

r.setups = require('./setups/_setups');
r.modules = require('./modules/_modules');
r.prototypes = require('./prototypes/_prototypes');
r.actions = require('./actions/_actions');

r.setups.setupConstants(() => {
	r.setups.setupSession(() => {
		r.setups.setupPaypal(() => {

			r.validators = require('./validators/_validators');

			r.setups.setupRoutes(() => {
				r.setups.setupDb(() => {

					r.AppConfig = r.mongoose.model('app_config', require('./schemas/AppConfigSchema'));
					r.Comment = r.mongoose.model('comment');
					r.ContactType = r.mongoose.model('contact_type');
					r.Counter = r.mongoose.model('counter');
					r.DeactivationReason = r.mongoose.model('deactivation_reason');
					r.Password = r.mongoose.model('password', require('./schemas/PasswordSchema'));
					r.Payment = r.mongoose.model('payment');
					r.Report = r.mongoose.model('report');
					r.ReportEvent = r.mongoose.model('report_event', require('./schemas/ReportEventSchema'));
					r.ReportPhoto = r.mongoose.model('report_photo', require('./schemas/ReportPhotoSchema'));
					r.User = r.mongoose.model('user');

					var server = r.https.createServer({
						key: r.fs.readFileSync(global.paths.root + '/utils/https/certs/server.key'),
    					cert: r.fs.readFileSync(global.paths.root + '/utils/https/certs/server.crt'),
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