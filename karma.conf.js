module.exports = function(config) {
  config.set({
    base: '/',
    proxies: {
      '/public/json': '/base/public/json',
      '/public/imgs': '/base/public/imgs',
      '/public/appStyles.css': '/base/public/unminified/appStyles.css'
    },
    plugins: ['karma-phantomjs-launcher', 'karma-jasmine-jquery', 'karma-jasmine', 'karma-babel-preprocessor', 'karma-spec-reporter'],
    frameworks: ['jasmine-jquery', 'jasmine'],
    preprocessors: {
      'directives/**/*spec.js': ['babel'],
      'tests/helpers/*.js': ['babel']
    },
    files: [
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/bootstrap/dist/js/bootstrap.min.js',
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-animate/angular-animate.min.js',
      'node_modules/angular-ui-router/release/angular-ui-router.min.js',
      'node_modules/angular-local-storage/dist/angular-local-storage.min.js',
      'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
      'node_modules/moment/min/moment-with-locales.min.js',
      'node_modules/angular-momentjs/angular-momentjs.min.js',
      'node_modules/ng-text-truncate/ng-text-truncate.js',
      'node_modules/lodash/lodash.min.js',
      'node_modules/restangular/dist/restangular.min.js',
      'node_modules/socket.io-client/dist/socket.io.slim.js',
      'node_modules/cropper/dist/cropper.min.js',
      'node_modules/accounting/accounting.min.js',
      'node_modules/money/money.js',
      'node_modules/js-marker-clusterer/src/markerclusterer_compiled.js',
      'node_modules/babel-polyfill/dist/polyfill.js',
      'app/**/*.js',
      'directives/**/*.js',
      'tests/helpers/*.js',
      { pattern: 'public/json/hardCodedData.json', watched: false, included: false, served: true },
      { pattern: 'public/imgs/*.png', watched: false, included: false, served: true },
      { pattern: 'public/unminified/appStyles.css', watched: false, included: false, served: true }
    ],
    reporters: ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
    concurrency: Infinity,
    babelPreprocessor: {
      options: {
        presets: ['es2015'],
        sourceMap: 'inline'
      }
    },
    proxyValidateSSL: false
  });
};