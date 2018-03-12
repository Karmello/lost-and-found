const libs = require('./_libs');

const src = 'app/content/**/*.html';
const dest = 'public/templates';

libs.gulp.task('page_templates', function() {
  libs.gulp.src(src)
    .pipe(libs.rename({ dirname: '' }))
    .pipe(libs.gulp.dest(dest))
    .pipe(libs.browserSync.stream());
});