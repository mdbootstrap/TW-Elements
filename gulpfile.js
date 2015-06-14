'use strict';

var gulp = require('gulp')
  , browserify = require('browserify')
  , bump = require('gulp-bump')
  , connect = require('gulp-connect')
  , eslint = require('gulp-eslint')
  , insert = require('gulp-insert')
  , rename = require('gulp-rename')
  , rimraf = require('gulp-rimraf')
  , sass = require('gulp-sass')
  , transform = require('vinyl-transform')
  , uglify = require('gulp-uglify')
  , zip = require('gulp-zip');

var version = '/* perfect-scrollbar v' + require('./package').version + ' */\n';

gulp.task('lint', function () {
  return gulp.src(['./src/**/*.js', './gulpfile.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('clean:js', function () {
  return gulp.src('./dist/js/*.js', {read: false})
    .pipe(rimraf());
});

gulp.task('clean:js:min', function () {
  return gulp.src('./dist/js/min/*.js', {read: false})
    .pipe(rimraf());
});

function browserified() {
  return transform(function (filename) {
    var b = browserify(filename);
    return b.bundle();
  });
}

gulp.task('js', ['clean:js'], function () {
  return gulp.src('./src/js/adaptor/*.js')
    .pipe(browserified())
    .pipe(insert.prepend(version))
    .pipe(rename(function (path) {
      if (path.basename === 'global') {
        path.basename = 'perfect-scrollbar';
      } else {
        path.basename = 'perfect-scrollbar.' + path.basename;
      }
    }))
    .pipe(gulp.dest('./dist/js'))
    .pipe(connect.reload());
});

gulp.task('js:min', ['clean:js:min'], function () {
  return gulp.src('./src/js/adaptor/*.js')
    .pipe(browserified())
    .pipe(uglify())
    .pipe(insert.prepend(version))
    .pipe(rename(function (path) {
      if (path.basename === 'global') {
        path.basename = 'perfect-scrollbar.min';
      } else {
        path.basename = 'perfect-scrollbar.' + path.basename + '.min';
      }
    }))
    .pipe(gulp.dest('./dist/js/min'));
});

gulp.task('clean:css', function () {
  return gulp.src('./dist/css/perfect-scrollbar.css', {read: false})
    .pipe(rimraf());
});

gulp.task('clean:css:min', function () {
  return gulp.src('./dist/css/perfect-scrollbar.min.css', {read: false})
    .pipe(rimraf());
});

gulp.task('sass', ['clean:css'], function () {
  return gulp.src('./src/css/main.scss')
    .pipe(sass())
    .pipe(insert.prepend(version))
    .pipe(rename('perfect-scrollbar.css'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(connect.reload());
});

gulp.task('sass:min', ['clean:css:min'], function () {
  return gulp.src('./src/css/main.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(insert.prepend(version))
    .pipe(rename('perfect-scrollbar.min.css'))
    .pipe(gulp.dest('./dist/css'));
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
  gulp.watch(['src/css/**/*'], ['sass']);
});

gulp.task('serve', ['connect', 'watch']);

gulp.task('compress', function () {
  return gulp.src('./dist/**')
    .pipe(zip('perfect-scrollbar.zip'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['lint', 'build']);
