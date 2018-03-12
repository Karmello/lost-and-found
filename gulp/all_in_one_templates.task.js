const libs = require('./_libs');

const src = [
  'app/**/*.html',
  '!app/content/index.html'
];

const file = 'all_in_one.html';
const dest = 'public/templates';

libs.gulp.task('all_in_one_template', function() {
  libs.gulp.src(src)
    .pipe(libs.concat(file))
    .pipe(libs.gulp.dest(dest));
});