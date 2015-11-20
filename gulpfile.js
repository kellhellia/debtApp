var gulp = require('gulp');
var webserver = require('gulp-webserver');
var less = require('gulp-less');
var path = require('path');

gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: true
    }));
});

gulp.task('less', function () {
  return gulp.src('./css/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./css'));
});

gulp.watch(['css/**/*.less'], ['less']);

gulp.task('default', function() {
  return gulp.run('webserver', 'less');
});