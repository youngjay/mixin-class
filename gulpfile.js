var gulp = require('gulp');
var fs = require('fs');
var concat = require('gulp-concat');
var Transform = require('stream').Transform

var through = function(transform, flush) {
    var t = new Transform({ objectMode: true });
    t._transform = transform;
    if (flush) {
        t._flush = flush;
    };
    return t
};

gulp.task('readme', function() {
    gulp.src(['intro.md', 'test/mixin-class.js', 'outro.md'])
        .pipe(concat('README.md'))
        .pipe(gulp.dest('.'))
})

gulp.task('default', ['readme']);
