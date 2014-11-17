var gulp = require('gulp');
var Dgeni = require('dgeni');

gulp.task('dgeni', function() {
  try {
    var dgeni = new Dgeni([require('./dgeni-conf')]);
    return dgeni.generate();
  } catch(x) {
    console.log(x.stack);
    throw x;
  }
});

gulp.task('assets', ['bower'], function() {
  // return gulp.src('bower_components/**/*')
  //   .pipe(gulp.dest('build/lib'));
});
