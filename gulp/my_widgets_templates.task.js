const libs = require('./_libs');

const src = 'app/my-widgets/**/*.html';
const dest = 'public/templates';

libs.gulp.task('my_widgets_templates', function() {
  libs.gulp.src(src)
    .pipe(libs.rename({ dirname: '' }))
    .pipe(libs.gulp.dest(dest))
    .pipe(libs.browserSync.stream());
});