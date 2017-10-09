var path = require('path');
var join = path.join;
var del = require('del');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var svgmin = require('gulp-svgmin');
var runSequence = require('run-sequence');
var insert = require('gulp-insert');
var replace = require('gulp-replace');
var cheerio = require('gulp-cheerio');

var DEST = 'out';
var SRC = 'src';

gulp.task('svg', function() {
	return gulp
		.src(join(SRC, '**/*.svg'))
		.pipe(
			svgmin({
				plugins: [
					{
						removeTitle: true // Убираем заголовки
					},
					{
						removeDesc: true // и описания
					},
					{
						sortAttrs: true // сортируем аттрибуты для наглядности
					},
					{
						removeStyleElement: true // на всякий случай убираем тэги <style>
					},
					{
						removeScriptElement: true // и <script>
					}
				]
			})
		)
		.pipe(
			cheerio(function($) {
				console.log($('svg').attr('width'));
			})
		)
		.pipe(gulp.dest(DEST));
});

// Чистим out
gulp.task('clean', function() {
	return del(DEST);
});

gulp.task('default', function() {
	runSequence('clean', ['svg']);
});
