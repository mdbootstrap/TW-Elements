'use strict';

var gulp = require('gulp')
  , bump = require('gulp-bump')
  , jshint = require('gulp-jshint')
  , rename = require('gulp-rename')
  , rimraf = require('gulp-rimraf')
  , sass = require('gulp-sass')
  , uglify = require('gulp-uglify');

gulp.task('lint', function () {
  return gulp.src(['./src/**/*.js', './gulpfile.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('clean:js', function () {
  return gulp.src('./out/perfect-scrollbar.js', {read: false})
    .pipe(rimraf());
});

gulp.task('uglify', ['clean:js'], function () {
  return gulp.src('./src/perfect-scrollbar.js')
    .pipe(uglify())
    .pipe(rename('perfect-scrollbar.min.js'))
    .pipe(gulp.dest('./out'));
});

gulp.task('clean:css', function () {
  return gulp.src('./out/perfect-scrollbar.css', {read: false})
    .pipe(rimraf());
});

gulp.task('sass', ['clean:css'], function () {
  return gulp.src('./src/perfect-scrollbar.scss')
    .pipe(sass())
    .pipe(gulp.dest('./out'));
});

gulp.task('clean:css:min', function () {
  return gulp.src('./out/perfect-scrollbar.css', {read: false})
    .pipe(rimraf());
});

gulp.task('sass:min', ['clean:css:min'], function () {
  return gulp.src('./src/perfect-scrollbar.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(rename('perfect-scrollbar.min.css'))
    .pipe(gulp.dest('./out'));
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

gulp.task('build', ['uglify', 'sass', 'sass:min']);
gulp.task('default', ['lint', 'build']);
