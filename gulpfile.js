
var gulp = require('gulp');

var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var karma = require('karma');
var bower = require('gulp-bower');
var beautifier = require('gulp-jsbeautifier');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'scripts']);
});

// Run tests
gulp.task('test', function(done) {
    karma.server.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('bower', function() {
    return bower();
});

gulp.task('beautifier', function() {
    gulp.src('./src/**/*.js')
        .pipe(beautifier({ mode: 'VERIFY_AND_WRITE'}))
        .pipe(gulp.dest('./src'));
    gulp.src('./test/**/*.js')
        .pipe(beautifier({ mode: 'VERIFY_AND_WRITE'}))
        .pipe(gulp.dest('./test'));
});

// Default Task
gulp.task('default', ['bower', 'scripts', 'test', 'watch']);
