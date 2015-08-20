
var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('default', function () {
	gulp.src('parola.js')
		.pipe(uglify({hoist_vars: true, unsafe: true}))
		.pipe(rename('parola.min.js'))
		.pipe(gulp.dest('./'));
});

