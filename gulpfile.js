var path = require("path");
var join = path.join;
var del = require("del");
var gulp = require('gulp');
var gulpif = require('gulp-if');
var svgmin = require('gulp-svgmin');
var runSequence = require("run-sequence");
var insert = require('gulp-insert');
var replace = require('gulp-replace');
var cheerio = require('gulp-cheerio');

var DEST = "out";
var	SRC = "src";

gulp.task('svg', function () {
	return gulp.src(join(SRC, "**/*.svg"))
		.pipe(svgmin({
			plugins: [{
				removeTitle: true
			}, {
				removeDesc: true
			}, {
				sortAttrs: true
			}, {
				removeElementsByAttr: true
			}, {
				removeStyleElement: true
			}, {
				removeScriptElement: true
			}]
		}))
	.pipe(replace(/<path\sd="M0\s0h18v18H0z"\/>/g, ''))
	.pipe(replace(/<path\sd="M0\s0h24v24H0z"\/>/g, ''))
	.pipe(replace(/<path\sd="M0\s0h30v30H0z"\/>/g, ''))
	.pipe(replace(/<path\sd="M0\s0h36v36H0z"\/>/g, ''))
	.pipe(replace(/<path\sfill="none"\sd="M0\s0h18v18H0z"\/>/g, ''))
	.pipe(replace(/<path\sfill="none"\sd="M0\s0h24v24H0z"\/>/g, ''))
	.pipe(replace(/<path\sfill="none"\sd="M0\s0h30v30H0z"\/>/g, ''))
	.pipe(replace(/<path\sfill="none"\sd="M0\s0h36v36H0z"\/>/g, ''))
	.pipe(replace(/<g\sfill="#FFF">/g, ''))
	.pipe(replace(/<g\sfill="none"\sfill-rule="evenodd">/g, ''))
	.pipe(replace(/<\/g>/g, ''))
	.pipe(gulpif(/color/, cheerio(function ($) {
		$('path[fill="#6D7986"]').remove();
		$('path').attr( "fill", "#FFF" );
	})))
	.pipe(insert.append('\n<!-- © 2017 Alfa Laboratory -->'))
	.pipe(gulp.dest(DEST));
});

gulp.task("clean", function() {
	return del(DEST);
});

gulp.task("default", function () {
	runSequence("clean", ["svg"]);
});
