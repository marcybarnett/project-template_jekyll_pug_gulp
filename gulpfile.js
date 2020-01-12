// --------------------------------------------
// Dependencies
// --------------------------------------------
const gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  rename = require('gulp-rename'),
  terser = require('gulp-terser'),
  images = require('gulp-imagemin'),
  strip = require('gulp-strip-comments'),
  // util = require('gulp-util'),
  gpug = require('gulp-pug'),
  // child = require('child_process'),
  spawn = process.platform === 'win32' ? require('win-spawn') : child.spawn,
  browserSync = require('browser-sync').create();

// paths
const styleSrc = './scss/**/*.scss',
  styleDest = './_site/assets/css/',
  // htmlSrc = './*.html',
  htmlDest = './build/',
  //vendorSrc = './js/vendors/',
  //vendorDest = './build/assets/js/',
  scriptSrc = './js/*.js',
  scriptDest = './_site/assets/js/',
  imgSrc = './img/',
  imgDest = './_site/assets/img/',
  siteRoot = "./_site",
  pugSrc = './pug/*.pug',
  // pugDest = './pug/output/';
  pugDest = './build/';


// --------------------------------------------
// Stand Alone Tasks
// --------------------------------------------

// compile scss
function style() {
  return gulp.src(styleSrc)
    .pipe(sass({
      style: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(gulp.dest(styleDest))
    .pipe(browserSync.stream());
}
exports.style = style;

// Compile Pug
function pug() {
  return gulp.src(pugSrc)
    .pipe(gpug({
      pretty: true
    }))
    .pipe(strip())
    .pipe(gulp.dest(pugDest));
}
exports.pug = pug;

// Build Site
function jekyllBuild() {
  return spawn("bundle", ["exec", "jekyll", "build"], {
    stdio: "inherit"
  });
}
exports.jekyllBuild = jekyllBuild;

// BrowserSync Reload
function browserSyncReload(done) {
  browserSync.reload();
  done();
}



// minify JS
function minifyScript() {
  return gulp.src(scriptSrc)
    .pipe(terser())
    .pipe(gulp.dest(scriptDest));
}
exports.minifyScript = minifyScript;

// optimize images
function imageMin() {
  return gulp.src(imgSrc)
    .pipe(images())
    .pipe(gulp.dest(imgDest));
}
exports.imageMin = imageMin;

// strip comments from Pug compiled HTML
function stripHtml() {
  return gulp.src(pugDest)
    .pipe(strip())
    .pipe(gulp.dest(htmlDest));
}
exports.stripHtml = stripHtml;

function watch() {
  // Serve files from the root of this project or local by flywheel
  browserSync.init({
    // proxy: "mbdev.local/",
    // open: true,
    server: {
      baseDir: siteRoot
    }
  });

  // run our taskss
  gulp.watch(styleSrc, style);
  gulp.watch(scriptSrc, minifyScript);
  gulp.watch(imgSrc, imageMin);
  gulp.watch(pugSrc, pug);
  // gulp.watch(pugDest, stripHtml);
  gulp.watch(htmlDest, gulp.series(jekyllBuild, browserSyncReload));

  // refresh browser
  gulp.watch(styleDest).on('change', browserSync.reload);
  gulp.watch(scriptDest).on('change', browserSync.reload);
  gulp.watch(imgDest).on('change', browserSync.reload);
  // gulp.watch(htmlDest).on('change', browserSync.reload);
  gulp.watch(siteRoot).on('change', browserSync.reload);

}
exports.watch = watch;