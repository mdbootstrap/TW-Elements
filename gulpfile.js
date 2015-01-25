'use strict';

var gulp = require('gulp')
  , browserify = require('browserify')
  , bump = require('gulp-bump')
  , connect = require('gulp-connect')
  , jshint = require('gulp-jshint')
  , rename = require('gulp-rename')
  , rimraf = require('gulp-rimraf')
  , sass = require('gulp-sass')
  , transform = require('vinyl-transform')
  , uglify = require('gulp-uglify');

gulp.task('lint', function () {
  return gulp.src(['./src/**/*.js', './gulpfile.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('clean:js', function () {
  return gulp.src('./out/js/perfect-scrollbar.js', {read: false})
    .pipe(rimraf());
});

gulp.task('clean:js:min', function () {
  return gulp.src('./out/js/perfect-scrollbar.min.js', {read: false})
    .pipe(rimraf());
});

function browserified() {
  return transform(function (filename) {
    var b = browserify(filename);
    return b.bundle();
  });
}

gulp.task('js', ['clean:js'], function () {
  return gulp.src('./src/js/main.js')
    .pipe(browserified())
    .pipe(rename('perfect-scrollbar.js'))
    .pipe(gulp.dest('./out/js'))
    .pipe(connect.reload());
});

gulp.task('js:min', ['clean:js:min'], function () {
  return gulp.src('./src/js/main.js')
    .pipe(browserified())
    .pipe(uglify())
    .pipe(rename('perfect-scrollbar.min.js'))
    .pipe(gulp.dest('./out/js'));
});

gulp.task('clean:css', function () {
  return gulp.src('./out/css/perfect-scrollbar.css', {read: false})
    .pipe(rimraf());
});

gulp.task('clean:css:min', function () {
  return gulp.src('./out/css/perfect-scrollbar.min.css', {read: false})
    .pipe(rimraf());
});

gulp.task('sass', ['clean:css'], function () {
  return gulp.src('./src/css/main.scss')
    .pipe(sass())
    .pipe(rename('perfect-scrollbar.css'))
    .pipe(gulp.dest('./out/css'))
    .pipe(connect.reload());
});

gulp.task('sass:min', ['clean:css:min'], function () {
  return gulp.src('./src/css/main.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(rename('perfect-scrollbar.min.css'))
    .pipe(gulp.dest('./out/css'));
});

function bumpType() {
  if (gulp.env.major) {
    return 'major';
  } else if (gulp.env.minor) {
    return 'minor';
  } else {
    return 'patch';
  }
}

gulp.task('bump', function () {
  gulp.src('./*.json')
    .pipe(bump({type: bumpType()}))
    .pipe(gulp.dest('./'));
});

gulp.task('release', ['bump', 'build']);

gulp.task('build', ['js', 'js:min', 'sass', 'sass:min']);

gulp.task('connect', ['build'], function () {
  connect.server({
    root: __dirname,
    livereload: true
  });
});

gulp.task('watch', function () {
  gulp.watch(['src/js/**/*'], ['js']);
  gulp.watch(['src/css/**/*'], ['css']);
});

gulp.task('serve', ['connect', 'watch']);

gulp.task('default', ['lint', 'build']);
