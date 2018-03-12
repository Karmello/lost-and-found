const cm = require(global.paths.server + '/cm');

module.exports = () => {

  cm.libs.mongoose.set('debug', true);

  cm.libs.mongoose.Promise = global.Promise;
  cm.libs.mongoose.connection.once('open', () => {
    cm.modules.utils.printFormattedLog('MongoDB: [open]');
  });

  return cm.libs.mongoose.connect(process.env.MONGO_URL);
};