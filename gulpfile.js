var nodemon = require('nodemon');
var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var ngAnnotate = require('gulp-ng-annotate');
var babel = require('gulp-babel');



var paths = {
    html: {
        directives: {
            source: 'directives/**/*.html',
            dest: 'public/directives'
        },
        pages: {
            source: 'public/pages/**/*.html'
        }
    },
    sass: ['sass/**/*.scss', 'directives/**/*.scss', '!sass/appStyles.scss'],
    js: ['scripts/**/*.js', 'directives/**/*.js'],
    dest: {
        unminified: { sass: 'unminified/', js: 'unminified/' },
        minified: { sass: 'minified/', js: 'minified/' }
    }
};



gulp.task('server', function() {
    nodemon({ script: 'server.js', watch: ['server.js', 'server/**/*.js'] });
});

gulp.task('compile', ['html_directives', 'sass', 'js'], function() {

    gulp.watch(paths.html.pages.source).on('change', browserSync.reload);
    gulp.watch(paths.html.directives.source, ['html_directives']);
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.js, ['js']);

    browserSync.init({
        snippetOptions: { ignorePaths: 'public/pages/*.html' },
        proxy: 'http://localhost:8080',
        ghostMode: false,
        browser: 'chrome'
    });
});

gulp.task('html_directives', function(done) {
    gulp.src(paths.html.directives.source)
    .pipe(browserSync.stream())
    .pipe(gulp.dest(paths.html.directives.dest))
    .on('end', done);
});

gulp.task('sass', function(done) {
    gulp.src(paths.sass, { 'base': 'sass/' })
    .pipe(concat('appStyles.scss'))
    .pipe(gulp.dest('sass/'))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
    .pipe(gulp.dest(paths.dest.unminified.sass))
    .pipe(browserSync.stream())
    .pipe(minifyCss({ keepSpecialComments: 0 }).on('error', function(err) { console.log('css parsing error', err); this.emit( 'end' ); }))
    .pipe(gulp.dest(paths.dest.minified.sass))
    .on('end', done);
});

gulp.task('js', function(done) {
    gulp.src(paths.js)
    .pipe(concat('appScripts.js'))
    .pipe(gulp.dest(paths.dest.unminified.js))
    .pipe(browserSync.stream())
    .pipe(ngAnnotate())
    .pipe(babel({ presets: ['es2015'], compact: false }))
    .pipe(uglify().on('error', gulpUtil.log))
    .pipe(gulp.dest(paths.dest.minified.js))
    .on('end', done);
});

gulp.task('build', function(done) {
    var src = ['server/**/*', 'public/**/*', 'minified/**/*', 'unminified/**/*', 'server.js', 'package.json'];
    gulp.src(src, { base: './' }).pipe(gulp.dest('./../prod'));
});