const libs = require('./_libs');

libs.gulp.task('build', function() {

  let version = process.argv[3].substring(1, process.argv[3].length);

  let singleFiles = libs.gulp.src(['server.js', 'package.json', '../prod/setup/.env'])
    .pipe(libs.rename({ dirname: '' }))
    .pipe(libs.gulp.dest('../prod/build/' + version));

  let publicFolder = libs.gulp.src('public/**/*').pipe(libs.gulp.dest('../prod/build/' + version + '/public'));
  let serverJs = libs.gulp.src('server/**/*').pipe(libs.gulp.dest('../prod/build/' + version + '/server'));

  return libs.merge(singleFiles, publicFolder, serverJs);
});