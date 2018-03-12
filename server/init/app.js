const cm = require(global.paths.server + '/cm');

module.exports = () => {

  return new cm.libs.Promise((resolve, reject) => {

    try {

      let app = cm.app;

      app.use(cm.libs.morgan('dev'));
      app.use(cm.libs.bodyParser.urlencoded({ extended: true }));
      app.use(cm.libs.bodyParser.json());
      app.use(cm.libs.methodOverride('X-HTTP-Method-Override'));

      app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
      });

      resolve();

    } catch (ex) { reject(ex); }
  });
};