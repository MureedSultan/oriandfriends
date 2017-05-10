const gulp = require('gulp');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const livereload = require('gulp-livereload');

const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

let sassInput = './public/stylesheets/sass/*.sass';

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
        .pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen();
  return gulp
    .watch('./public/stylesheets/sass/**', ['css'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('default', ['css', 'watch']);
