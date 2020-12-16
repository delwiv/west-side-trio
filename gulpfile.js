// Include gulp
var gulp = require('gulp');

// Include plugins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var recess = require('gulp-recess');
var watch  = require('gulp-watch');
var gutil  = require('gulp-util');
var bower  = require('gulp-bower');
var spawn = require('child_process').spawn;
var sass = require('gulp-sass');
var node;

var ngAnnotate = require('gulp-ng-annotate');

gulp.task('watch-js', function () {
	watch('client/js/**/*.js', function(files){
		gulp.start('scripts');
	});
});

// gulp.task('bower', function(){
//     return bower()
//     // .pipe(recess().on('error', gutil.log))
//     .pipe(concat('delwiv-labs-deps.js'))
//     .pipe(rename({suffix: '.min'}))
//     .pipe(uglify())
//     .pipe(gulp.dest('client/dist'))
// })

gulp.task('server', function(){
	if (node) node.kill()
	node = spawn('node', ['server/server.js'], {stdio: 'inherit'})
	node.on('close', function (code) {
		if (code === 8) {
		 	gulp.log('Error detected, waiting for changes...');
		}
	});
});

gulp.task('sass', function() {
    gulp.src('client/js/**/*.scss', {style: 'compressed'})
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('boheme.css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('client/dist'));
});


// Concatenate JS Files
gulp.task('scripts', function() {
	return gulp.src('client/js/**/*.js')
	.pipe(ngAnnotate())
	// .pipe(recess().on('error', gutil.log))
	.pipe(concat('boheme.js'))
	.pipe(rename({suffix: '.min'}))
	// .pipe(uglify())
	.pipe(gulp.dest('client/dist'));
});

// Default Task
gulp.task('default', ['server', 'scripts', 'watch-js', 'sass'], function() {
	gulp.watch('client/**/*.scss', ['sass']);
	gulp.watch('client/**/*.js', ['scripts']);
	gulp.watch('server/**/*.js', ['server']);
});
