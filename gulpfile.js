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
				removeTitle: true // Убираем заголовки
			}, {
				removeDesc: true // и описания
			}, {
				sortAttrs: true // сортируем аттрибуты для наглядности
			}, {
				removeStyleElement: true // на всякий случай убираем тэги <style>
			}, {
				removeScriptElement: true // и <script>
			}]
		}))
	.pipe(replace(/<path\sd="M0\s0h18v18H0z"\/>/g, '')) // убираем квадраты из скетча
	.pipe(replace(/<path\sd="M0\s0h24v24H0z"\/>/g, '')) // которые делают дизайнеры,
	.pipe(replace(/<path\sd="M0\s0h30v30H0z"\/>/g, '')) // чтобы иконки были одного
	.pipe(replace(/<path\sd="M0\s0h36v36H0z"\/>/g, '')) // размера
	.pipe(replace(/<path\sfill="none"\sd="M0\s0h18v18H0z"\/>/g, ''))
	.pipe(replace(/<path\sfill="none"\sd="M0\s0h24v24H0z"\/>/g, ''))
	.pipe(replace(/<path\sfill="none"\sd="M0\s0h30v30H0z"\/>/g, ''))
	.pipe(replace(/<path\sfill="none"\sd="M0\s0h36v36H0z"\/>/g, ''))
	.pipe(replace(/<g\sfill="#FFF">/g, '')) // убираем группу с фоном
	.pipe(replace(/<g\sfill="none"\sfill-rule="evenodd">/g, '')) // и с пустой заливкой
	.pipe(replace(/<\/g>/g, '')) // и их закрывающие тэги
	.pipe(gulpif(/color/, cheerio(function ($) { // для color картинок
		$('path[fill="#6D7986"]').remove(); // убираем тэг с фоном, который генерирует скетч
		$('path').attr( "fill", "#FFF" ); // и даем всем path белую заливку, которую убили выше в группе
	})))
	.pipe(insert.append('\n<!-- © 2017 Alfa Laboratory -->')) // ну и копирайт, конечно
	.pipe(gulp.dest(DEST));
});

// Чистим out
gulp.task("clean", function() {
	return del(DEST);
});

gulp.task("default", function () {
	runSequence("clean", ["svg"]);
});
