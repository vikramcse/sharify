var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('vendor', function() {
  return gulp.src([
    'bower_components/jquery/dist/jquery.js',
    'bower_components/toastr/toastr.js'
  ]).pipe(concat('vendor.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('styles', function() {
  return gulp.src([
    'bower_components/toastr/toastr.min.css',
    'bower_components/mui/packages/cdn/css/mui.min.css',
    'app/css/app.css'
  ])
    .pipe(concat('style.css'))
    .pipe(gulp.dest('build/css'));
});

gulp.task('default', ['vendor', 'styles']);
