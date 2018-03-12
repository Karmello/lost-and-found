const libs = require('./_libs');

libs.gulp.task('compile', [
  'all_in_one_template',
  'page_templates',
  'component_templates',
  'my_widgets_templates',
  'client_js',
  'resources'
], function() {

  // Html
  libs.gulp.watch('app/content/**/*.html', ['all_in_one_template', 'page_templates']);
  libs.gulp.watch(['app/components/**/*.html'], ['all_in_one_template', 'component_templates']);
  libs.gulp.watch(['app/my-widgets/**/*.html'], ['all_in_one_template', 'my_widgets_templates']);
  
  // Styles
  libs.gulp.watch(['app/**/*.scss', '!app/styles/appStyles.scss'], ['styles']);
  
  // Js
  libs.gulp.watch(['app/**/*.js'], ['client_js']);
  
  // Json
  libs.gulp.watch('resources/json/**/*.json', ['json']);

  // Running app
  libs.browserSync.init({
    snippetOptions: { ignorePaths: 'public/templates/*.html' },
    proxy: 'https://localhost:8080',
    ghostMode: false,
    browser: 'chrome',
    https: {
      key: 'utils/https/certs/server.key',
      cert: 'utils/https/certs/server.crt'
    }
  });

  libs.gulp.start('styles');
});