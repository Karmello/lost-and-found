module.exports = function(config) {
    config.set({
        basePath: 'D:/Workspace/laf/dev',
        proxies: {
            '/public/json': 'http://localhost:3000/public/json',
            '/session': 'http://localhost:3000/session',
            '/public/appStyles.css': 'http://localhost:3000/public/appStyles.css'
        },
        frameworks: ['jasmine-jquery', 'jasmine'],
        preprocessors: {
            'scripts/**/*.js': ['babel'],
            'directives/**/*.js': ['babel'],
            'tests/client/**/*Spec.js': ['babel'],
        },
        files: [
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/angular/angular.js',
            'node_modules/moment/min/moment-with-locales.min.js',
            'node_modules/angular-momentjs/angular-momentjs.min.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'node_modules/angular-animate/angular-animate.min.js',
            'node_modules/angular-ui-router/release/angular-ui-router.min.js',
            'node_modules/restangular/dist/restangular.min.js',
            'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
            'node_modules/angular-local-storage/dist/angular-local-storage.min.js',
            'node_modules/lodash/lodash.min.js',
            'node_modules/babel-polyfill/dist/polyfill.js',
            'scripts/**/*.js',
            'directives/**/*.js',
            'tests/client/helpers.js',
            'tests/client/**/*Spec.js'
        ],
        //exclude: ['tests/client/*Spec.js'],
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
        }
    });
};