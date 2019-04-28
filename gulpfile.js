const gulp = require('gulp');
const chromeManifest = require('gulp-chrome-manifest');
const clean = require('gulp-clean');
const gulpif = require('gulp-if');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify-es').default;
const useref = require('gulp-useref');
const zip = require('gulp-zip');

const pkg = require('./package.json');

gulp.task('clean', () => gulp.src(['build'], { allowEmpty: true, read: false })
  .pipe(clean()));

gulp.task('manifest', () => gulp.src('src/manifest.json')
  .pipe(chromeManifest({
    background: {
      target: 'js/background.js',
    },
    buildnumber: pkg.version,
  }))
  .pipe(gulpif(
    '*.js',
    // eslint-disable-next-line comma-dangle
    uglify()
  ))
  .pipe(gulp.dest('../build/src')));

gulp.task('html', () => gulp.src('src/*.html')
  .pipe(useref({ searchPath: ['src'] }))
  .pipe(gulpif('*.js', uglify()))
  .pipe(gulpif('*.html', htmlmin({
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    minifyCSS: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeOptionalTags: true,
    removeRedundantAttributes: true,
  })))
  .pipe(gulp.dest('./build/src')));

gulp.task('static', () => gulp.src(['src/{images,fonts}/*.*'], { dot: true })
  .pipe(gulp.dest('./build/src')));


gulp.task('package', () => {
  const manifest = require('./build/src/manifest.json'); // eslint-disable-line import/no-unresolved, global-require
  return gulp.src('./build/src/**')
    .pipe(zip(`${manifest.name}-${manifest.version}.zip`))
    .pipe(gulp.dest('./build/release'));
});


gulp.task('build', gulp.series('clean', 'manifest', 'html', 'static', done => done()));
gulp.task('release', gulp.series('build', 'package', done => done()));
gulp.task('default', gulp.series('release', done => done()));
