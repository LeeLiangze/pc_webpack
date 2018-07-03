var gulp = require('gulp');
var css = require('gulp-minify-css');
var concat = require('gulp-concat');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var urlAdjuster = require('gulp-css-url-adjuster');
var sftp = require('gulp-sftp');

gulp.task('concat', function() {
  gulp.src(['src/assets/css/ng-common/*.css','src/assets/css/*.css'])
      .pipe(urlAdjuster({replace: ['../../img','/img']}))
      .pipe(urlAdjuster({replace:['../img', '/img']}))
      .pipe(concat('style.min.css'))
      .pipe(css())
      .pipe(gulp.dest('build/css'))
});

gulp.task('concatbuild', function() {
  gulp.src(['src/assets/css/ng-common/*.css','src/assets/css/*.css'])
      .pipe(urlAdjuster({replace: ['../../img','/img']}))
      .pipe(urlAdjuster({replace:['../img', '/img']}))
      .pipe(concat('style.min.css'))
      .pipe(css())
      .pipe(rev())
      .pipe(gulp.dest('build/css'))
      .pipe(rev.manifest())
      .pipe(gulp.dest('./'))
});

gulp.task('rev', function() {
  gulp.src(['./rev-manifest.json', './build/modules/**'],{base: "./"})
      .pipe(revCollector())
      .pipe(gulp.dest('.'));
});

gulp.task('watch', ['concat','concatbuild','rev']);

gulp.task('default', ['concatbuild','rev']);

gulp.task('copy',  function() {
  gulp.src('build/**/*')
        .pipe(gulp.dest('../main/webapp'))
});

gulp.task('deploy', function () {
  gulp.src('build/*')
        .pipe(sftp({
            host: 'localhost',
            remotePath: 'path/to/root',
            user: 'admin',
            pass: 'password'
        }))
});