const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const pkg = require('./package.json');

gulp.task('clean', () => gulp.src(['build'], { allowEmpty: true, read: false })
  .pipe(plugins.clean()));

gulp.task('manifest', () => gulp.src('src/manifest.json')
  .pipe(plugins.chromeManifest({
    background: {
      target: 'js/background.js',
    },
    buildnumber: pkg.version,
  }))
  .pipe(plugins.if(
    '*.js',
    plugins.uglifyEs.default(),
  ))
  .pipe(gulp.dest('../build/src')));

gulp.task('html', () => gulp.src('src/*.html')
  .pipe(plugins.useref({ searchPath: ['src'] }))
  .pipe(plugins.if('*.js', plugins.uglifyEs.default()))
  .pipe(plugins.if('*.html', plugins.htmlmin({
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
    .pipe(plugins.zip(`${manifest.name}-${manifest.version}.zip`))
    .pipe(gulp.dest('./build/release'));
});


// gulp.task('package', () => {
//   const manifest = require('./build/src/manifest.json');
//   // eslint-disable-line import/no-unresolved, global-require
//   const privateKey = fs.readFileSync('./certs/key', 'utf8');
//   const filename = `${manifest.name}-${manifest.version}.crx`;
//   return gulp.src('./build/src')
//     .pipe(plugins.crxPack({
//       privateKey,
//       filename,
//     }))
//     .pipe(gulp.dest('./build/release'));
// });

gulp.task('build', gulp.series('clean', 'manifest', 'html', 'static', done => done()));
gulp.task('release', gulp.series('build', 'package', done => done()));
gulp.task('default', gulp.series('release', done => done()));
