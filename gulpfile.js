var gulp = require('gulp');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var less = require('gulp-less');
var min_css = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var connect = require('gulp-connect');
var Proxy = require('gulp-connect-proxy');
var uglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('connect', function() {
    connect.server({
        root: './',
        ip: '127.0.0.1',
        livereload: {
            port: 35726
        },
        port: 8078,
        middleware: function (connect, opt) {
            opt.route = '/proxy';
            var proxy = new Proxy(opt);
            return [proxy];
        }
    })
});

gulp.task('html', function () {
    return gulp.src('./*/*.html')
        .pipe(connect.reload());
});
gulp.task('css', function () {
    return gulp.src('./css/*.css')
        // .pipe(postcss([autoprefixer()]))
        // .pipe(gulp.dest('./dist/css'))
        .pipe(connect.reload());
});
gulp.task('js', function () {
    return gulp.src('./index.js')
        .pipe(connect.reload());
});

gulp.task('less', function () {
    return gulp.src('./devCss/*.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(postcss([autoprefixer({browsers: ['> 1%'], cascade: false})]))
        .pipe(min_css())
        .pipe(gulp.dest('./css'))
        .pipe(connect.reload());
});

gulp.task('build_css', function() {
    return gulp.src('./css/*.css')
        // .pipe(concat('main.min.css'))
        .pipe(min_css())
        .pipe(gulp.dest('./dist'))
});

gulp.task('build_js', function(cb) {
    pump([
        gulp.src('./index.js'),
        // sourcemaps.init(),
        // concat('app.min.js'),
        uglify(),
        // sourcemaps.write(),
        gulp.dest('./dist')
    ],cb);

});

gulp.task('watch', function () {
    gulp.watch('./css/*.css', ['css']);
    gulp.watch('./js/*.js', ['js']);
    gulp.watch('./*.html', ['html']);
});

gulp.task('dev', ['connect', 'watch']);

gulp.task('build', ['build_js']);


