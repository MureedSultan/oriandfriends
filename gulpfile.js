const gulp = require('gulp');
const browserSync = require('browser-sync').create();

const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const postcss = require('gulp-postcss');

const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

let sassInput = './public/stylesheets/sass/*.sass';

// Static Server + watching scss/html files
gulp.task('serve', ['css'], function() {

    browserSync.init({
        proxy: "localhost:3002"
    });

    gulp.watch('./public/stylesheets/sass/**', ['css']);
    gulp.watch("./views/**").on('change', browserSync.reload);
    gulp.watch("./public/javascripts/**").on('change', browserSync.reload);
});

gulp.task('css', function () {
    let processors = [
        autoprefixer,
        cssnano
    ];
    return gulp.src(sassInput)
        .pipe(sassGlob())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(gulp.dest('./public/stylesheets'))
        .pipe(browserSync.stream());
});


gulp.task('default', ['serve']);
