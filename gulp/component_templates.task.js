const libs = require('./_libs');

const src = 'app/components/**/*.html';
const dest = 'public/templates';

libs.gulp.task('component_templates', function() {
  libs.gulp.src(src)
    .pipe(libs.rename({ dirname: '' }))
    .pipe(libs.gulp.dest(dest))
    .pipe(libs.browserSync.stream());
});