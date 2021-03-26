var gulp = require('gulp');
var sass = require('gulp-sass');
var uglifycss = require('gulp-uglifycss');
const minify = require('gulp-minify');

gulp.task('sass', function () {
    return gulp.src('./sass/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./css'));
});
 
gulp.task('css', function () {
  gulp.src('./css/*.css')
    .pipe(uglifycss({
      "uglyComments": true
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('js', function() {
  gulp.src('./js/*.js')
    .pipe(minify())
    .pipe(gulp.dest('dist'))
});

gulp.task('default', function(){
    gulp.watch('./sass/*.scss', gulp.series('sass')),
    gulp.watch('./css/*.css', gulp.series('css')),
    gulp.watch('./js/*.js', gulp.series('js'));
  return
});