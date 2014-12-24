/* global require */
/* global console */

var gulp = require('gulp')
var jshint = require('gulp-jshint')
var connect = require('gulp-connect')
var mochaPhantomJS = require('gulp-mocha-phantomjs')
var rjs = require('gulp-requirejs')
var exec = require('child_process').exec

var istanbul = require('gulp-istanbul')
var mocha = require('gulp-mocha')
var coveralls = require('gulp-coveralls')

gulp.task('hello', function() {
    console.log((function() {
        /*

Mock

        */
    }).toString().split('\n').slice(2, -2).join('\n') + '\n')
})

// https://github.com/AveVlad/gulp-connect
gulp.task('connect', function() {
    /* jshint unused:false */
    connect.server({
        port: 5050,
        middleware: function(connect, opt) {
            return [
                // https://github.com/senchalabs/connect/#use-middleware
                function cors(req, res, next) {
                    res.setHeader('Access-Control-Allow-Origin', '*')
                    res.setHeader('Access-Control-Allow-Methods', '*')
                    next()
                }
            ]
        }
    })
})

// https://github.com/spenceralger/gulp-jshint
gulp.task('jshint', function() {
    var globs = [
        'src/**/*.js', 'test/test.*.js', 'gulpfile.js', '!**/regexp/parser.js'
    ]
    return gulp.src(globs)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
})

// https://github.com/mrhooray/gulp-mocha-phantomjs
gulp.task('mocha', function() {
    return gulp.src('test/test.mock.html')
        .pipe(mochaPhantomJS({
            reporter: 'spec'
        }))
})

// https://github.com/RobinThrift/gulp-requirejs
gulp.task('rjs', function() {
    var build = {
        baseUrl: 'src',
        out: 'dist/mock.js',
        name: 'mock',
        paths: {
            canvas: 'empty:'
        }
    }
    rjs(build)
        .pipe(gulp.dest('.')) // pipe it to the output DIR
})

// https://github.com/floatdrop/gulp-watch
var watchTasks = ['hello', 'madge', 'jshint', 'rjs', 'mocha']
gulp.task('watch', function( /*callback*/ ) {
    gulp.watch(['src/**/*.js', 'gulpfile.js', 'test/*'], watchTasks)
})

// https://github.com/pahen/madge
gulp.task('madge', function( /*callback*/ ) {
    exec('madge --format amd ./src/',
        function(error, stdout /*, stderr*/ ) {
            if (error) console.log('exec error: ' + error)
            console.log('module dependencies:')
            console.log(stdout)
        }
    )
    exec('madge --format amd --image ./doc/dependencies.png ./src/',
        function(error /*, stdout, stderr*/ ) {
            if (error) console.log('exec error: ' + error)
        }
    )
})

// TODO

// https://github.com/SBoudrias/gulp-istanbul
gulp.task('istanbul', function(cb) {
    gulp.src(['test/test.coveralls.js'])
        .pipe(istanbul()) // Covering files
        .pipe(istanbul.hookRequire()) // Force `require` to return covered files
        .on('finish', function() {
            gulp.src(['test/test.coveralls.js'])
                .pipe(mocha({}))
                .pipe(istanbul.writeReports()) // Creating the reports after tests runned
                .on('end', cb)
        })
})
gulp.task('istanbulForMochaPhantomJS', function(cb) {
    gulp.src(['dist/mock.js'])
        .pipe(istanbul()) // Covering files
        .pipe(istanbul.hookRequire()) // Force `require` to return covered files
        .on('finish', function() {
            gulp.src(['test/test.mock.html'])
                .pipe(mochaPhantomJS({reporter: 'spec'}))
                .pipe(istanbul.writeReports()) // Creating the reports after tests runned
                .on('end', cb)
        })
})

// https://github.com/markdalgleish/gulp-coveralls
gulp.task('coveralls', ['istanbul'], function() {
    return gulp.src('coverage/**/lcov.info')
        .pipe(coveralls())
})

// 
gulp.task('publish', function() {
    var child_process = require('child_process')
    child_process.exec('ls', function(error, stdout, stderr) {
        console.log(error, stdout, stderr)
    })
})

gulp.task('default', watchTasks.concat(['watch', 'connect']))
gulp.task('build', ['jshint', 'rjs', 'mocha'])