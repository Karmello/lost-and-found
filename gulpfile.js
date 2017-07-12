var r = {
    autoprefixer : require('gulp-autoprefixer'),
    babel: require('gulp-babel'),
    browserSync: require('browser-sync').create(),
    cleanCss: require('gulp-clean-css'),
    concat: require('gulp-concat'),
    debug: require('gulp-debug'),
    gulp: require('gulp'),
    util: require('gulp-util'),
    merge: require('merge-stream'),
    mergeJson: require('gulp-merge-json'),
    ngAnnotate: require('gulp-ng-annotate'),
    nodemon: require('nodemon'),
    rename: require('gulp-rename'),
    rimraf: require('gulp-rimraf'),
    sass: require('gulp-sass'),
    sprity: require('sprity'),
    uglify: require('gulp-uglify')
};



r.gulp.task('compile', ['all_in_one_templates', 'page_templates', 'directive_templates', 'client_js', 'styles', 'resources'], function() {

    r.gulp.start('styles');
});

r.gulp.task('page_templates', function() {

    r.gulp.src('templates/*.html')
        .pipe(r.rename({ dirname: '' }))
        .pipe(r.gulp.dest('public/templates'))
        .pipe(r.browserSync.stream());
});

r.gulp.task('directive_templates', function() {

    r.gulp.src('directives/**/*.html')
        .pipe(r.rename({ dirname: '' }))
        .pipe(r.gulp.dest('public/templates'))
        .pipe(r.browserSync.stream());
});

r.gulp.task('all_in_one_templates', function() {

    r.gulp.src(['templates/*.html', '!templates/index.html', 'directives/**/*.html'])
    .pipe(r.concat('all_in_one.html'))
    .pipe(r.gulp.dest('public/templates'));
});

r.gulp.task('client_js', function() {

    r.gulp.src(['js/client/**/*.js', 'directives/**/*.js'])
    .pipe(r.concat('appScripts.js'))
    .pipe(r.gulp.dest('public/unminified/'))
    .pipe(r.ngAnnotate())
    .pipe(r.babel({ presets: ['es2015'], compact: false }))
    .pipe(r.uglify().on('error', r.util.log))
    .pipe(r.gulp.dest('public/minified/'))
    .pipe(r.browserSync.stream());
});

r.gulp.task('styles', function() {

    r.gulp.src(['styles/**/*.scss', '!styles/appStyles.scss', 'directives/**/*.scss'], { 'base': 'styles/' })
        .pipe(r.concat('appStyles.scss'))
        .pipe(r.gulp.dest('styles/'))
        .pipe(r.sass().on('error', r.sass.logError))
        .pipe(r.autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
        .pipe(r.gulp.dest('public/unminified/'))
        .pipe(r.cleanCss({ keepSpecialComments: 0 }).on('error', function(err) { console.log('css parsing error', err); this.emit( 'end' ); }))
        .pipe(r.gulp.dest('public/minified/'))
        .pipe(r.browserSync.stream());
});

r.gulp.task('resources', function() {

    var singleJson = r.gulp.src('resources/json/*.json').pipe(r.gulp.dest('public/json'));

    var multipleJson = r.gulp.src('resources/json/hardCoded/*.json')
                        .pipe(r.mergeJson({ fileName: 'hardCodedData.json' }))
                        .pipe(r.gulp.dest('public/json'));

    var imgs = r.gulp.src('resources/imgs/*.*').pipe(r.gulp.dest('./public/imgs/'));

    return r.merge(singleJson, multipleJson, imgs);
});



r.gulp.task('fireup', ['compile'], function() {

    //r.gulp.watch('public/pages/**/*.html').on('change', r.browserSync.reload);

    r.gulp.watch('templates/*.html', ['all_in_one_templates', 'page_templates']);
    r.gulp.watch('directives/**/*.html', ['all_in_one_templates', 'directive_templates']);
    r.gulp.watch(['styles/**/*.scss', '!styles/appStyles.scss', 'directives/**/*.scss'], ['styles']);
    r.gulp.watch(['js/client/**/*.js', 'directives/**/*.js'], ['client_js']);
    r.gulp.watch('resources/json/**/*.json', ['json']);

    r.nodemon({ script: 'server.js', watch: ['server.js', 'js/server/**/*.js'] });

    r.browserSync.init({
        snippetOptions: { ignorePaths: 'public/templates/*.html' },
        proxy: 'https://localhost:8080',
        ghostMode: false,
        browser: 'chrome',
        https: {
            key: 'utils/https/certs/server.key',
            cert: 'utils/https/certs/server.crt'
        }
    });
});

r.gulp.task('build', function() {

    var version = process.argv[3].substring(1, process.argv[3].length);

    var singleFiles = r.gulp.src(['server.js', 'package.json', '../prod/setup/.env'])
                    .pipe(r.rename({ dirname: '' }))
                    .pipe(r.gulp.dest('../prod/build/' + version));

    var publicFolder = r.gulp.src('public/**/*').pipe(r.gulp.dest('../prod/build/' + version + '/public'));
    var serverJs = r.gulp.src('js/server/**/*').pipe(r.gulp.dest('../prod/build/' + version + '/js/server'));

    return r.merge(singleFiles, publicFolder, serverJs);
});