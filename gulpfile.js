var gulp = require('gulp'); 
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var wrap = require('gulp-wrap');
 

gulp.task('lint', function() {
    return gulp.src('src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
    return gulp.src('src/*.js')
        .pipe(concat('PixiSimpleFramework.js',{process: function(src, filePath) { 
            return (src.trim() + '\n').replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1'); 
            }}))
        .pipe(gulp.dest('bin'))
        .pipe(gulp.dest('example/static/js'))
});

gulp.task('default', ['lint', 'scripts']);
