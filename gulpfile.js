var gulp = require('gulp');
var markdown = require('gulp-markdown');
var plumber = require('gulp-plumber');
var rename = require("gulp-rename");

var nunjucks = require("nunjucks");
var through = require('through2');

nunjucks.configure({autoescape: false});

function md_rename (path) {
  if (path.basename == 'README') {
    path.basename = 'index';
  }

  path.extname = ".html";
}

function render () {
  return through.obj(function(file, encoding, callback) {
    if (!file.isNull()) {
      var html = nunjucks.render('base.html', {content: String(file.contents)});
      file.contents = new Buffer(html);
    }

    return callback(null, file);
  });
}

gulp.task('copy-html', function () {
  return gulp.src(["**/*.html", "!public/**/*", "!node_modules/**/*"])
    .pipe(plumber())
    .pipe(gulp.dest("public"));
});

gulp.task('build-markdown', function () {
  return gulp.src(["**/*.md", "!public/**/*", "!node_modules/**/*"])
    .pipe(plumber())
    .pipe(markdown())
    .pipe(render())
    .pipe(rename(md_rename))
    .pipe(gulp.dest("public"));
});

var build_tasks = ['copy-html', 'build-markdown'];

gulp.task('default', build_tasks);

gulp.task('watch', build_tasks, function () {
  gulp.watch(["**/*.html", "**/*.md", "!public/**/*", "!node_modules/**/*"], build_tasks);
});
