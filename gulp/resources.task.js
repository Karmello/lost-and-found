const libs = require('./_libs');

libs.gulp.task('resources', function() {

  let countries =
    libs.gulp.src('resources/json/countries.json')
      .pipe(libs.gulp.dest('public/json'));

  let hardCodedData =
    libs.gulp.src(['resources/json/app-hard-coded-data/*.json', 'app/my-widgets/hard-coded-data/*.json'])
      .pipe(libs.mergeJson({ fileName: 'hardCodedData.json' }))
      .pipe(libs.gulp.dest('public/json'));

  let imgs =
    libs.gulp.src('resources/imgs/*.*')
      .pipe(libs.gulp.dest('./public/imgs/'));

  return libs.merge(countries, hardCodedData, imgs);
});