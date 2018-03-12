const libs = require('./_libs');

const src = [
  'app/**/*.js',
  '!**/*.spec.js'
];

const file = 'appScripts.js';
const dest1 = 'public/unminified/';
const dest2 = 'public/minified/';

libs.gulp.task('client_js', function() {
  libs.gulp.src(src)
    .pipe(libs.concat(file, { newLine: '\n\n' }))
    .pipe(libs.gulp.dest(dest1))
    .pipe(libs.uglify().on('error', libs.util.log))
    .pipe(libs.gulp.dest(dest2))
    .pipe(libs.browserSync.stream());
});