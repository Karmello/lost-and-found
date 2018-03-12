const libs = require('./_libs');

const src = [
  'app/**/*.scss',
  '!app/styles/appStyles.scss'
];

const file = 'appStyles.scss';
const dest1 = 'app/styles/';
const dest2 = 'public/unminified/';
const dest3 = 'public/minified/';

libs.gulp.task('styles', function() {
  libs.gulp.src(src, { 'base': 'styles/' })
    .pipe(libs.concat(file))
    .pipe(libs.gulp.dest(dest1))
    .pipe(libs.sass().on('error', libs.sass.logError))
    .pipe(libs.autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
    .pipe(libs.gulp.dest(dest2))
    .pipe(libs.cleanCss({ keepSpecialComments: 0 }).on('error', function(err) {
      console.log('css parsing error', err);
      this.emit( 'end' );
    }))
    .pipe(libs.gulp.dest(dest3))
    .pipe(libs.browserSync.stream());
});