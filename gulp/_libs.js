module.exports = {
  autoprefixer : require('gulp-autoprefixer'),
  browserSync: require('browser-sync').create(),
  cleanCss: require('gulp-clean-css'),
  concat: require('gulp-concat'),
  debug: require('gulp-debug'),
  gulp: require('gulp'),
  merge: require('merge-stream'),
  mergeJson: require('gulp-merge-json'),
  nodemon: require('nodemon'),
  rename: require('gulp-rename'),
  rimraf: require('gulp-rimraf'),
  sass: require('gulp-sass'),
  sprity: require('sprity'),
  uglify: require('gulp-uglify'),
  util: require('gulp-util')
};