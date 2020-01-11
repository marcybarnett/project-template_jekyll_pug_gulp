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
    browserSync = require('browser-sync').create();

// paths
const styleSrc = './scss/**/*.scss',
    styleDest = './build/css/',
    htmlSrc = './*.html',
    htmlDest = './build/',
    //vendorSrc = './js/vendors/',
    //vendorDest = './build/assets/js/',
    scriptSrc = './js/*.js',
    scriptDest = './build/js/',
    imgSrc = './img/',
    imgDest = './build/img/';

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

// strip comments from HTML
function stripHtml() {
    return gulp.src(htmlSrc)
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
            baseDir: "./build"
        }
    });

    // run our tasks
    gulp.watch(styleSrc, style);
    gulp.watch(scriptSrc, minifyScript);
    gulp.watch(imgSrc, imageMin);
    gulp.watch(htmlSrc, stripHtml);

    // refresh browser
    gulp.watch(styleDest).on('change', browserSync.reload);
    gulp.watch(scriptDest).on('change', browserSync.reload);
    gulp.watch(imgDest).on('change', browserSync.reload);
    gulp.watch(htmlDest).on('change', browserSync.reload);

}
exports.watch = watch;