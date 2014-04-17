var gulp = require('gulp');
var fs = require('fs');
var Transform = require('stream').Transform

var through = function(transform, flush) {
    var t = new Transform({ objectMode: true });
    t._transform = transform;
    if (flush) {
        t._flush = flush;
    };
    return t
};

// stop exit
gulp.on('stop', function() {
    process.exit(1)
});

gulp.task('readme', function() {
    var INTRO = ['mixin-class', '===========', 'mixin style inherit', '```javascript', ''].join('\n');
    var OUTRO = ['', '```'].join('\n');

    gulp.src('test/index.js')
        .pipe(through(function(file, enc, cb) {  
            this.push(INTRO);
            this.push(file.contents);
            this.push(OUTRO);
            cb()
        }))
        .pipe(fs.createWriteStream('README.md'))
})

gulp.task('default', ['readme']);
