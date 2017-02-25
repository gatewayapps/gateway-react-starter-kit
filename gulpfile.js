var os = require('os')

var gulp = require('gulp')
var clean = require('gulp-clean')
var babel = require('gulp-babel')
var spawn = require('child_process').spawn
var plumber = require('gulp-plumber')
var sourcemaps = require('gulp-sourcemaps')
var nodemon = require('gulp-nodemon')
var runSequence = require('run-sequence')
var bunyan

var srcPath = 'src/server'
var srcFilePattern = '/**/*.js'
var distPath = 'dist/server'

gulp.task('clean-server', function () {
  return gulp.src([distPath], { read: false })
        .pipe(clean())
})

gulp.task('babel-server', function () {
  return gulp.src([srcPath + srcFilePattern])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(distPath))
})

gulp.task('set-dev-node-env', function () {
  process.env.NODE_ENV = 'development'
  process.env.SUPPRESS_NO_CONFIG_WARNING = 'true'
  return
})

gulp.task('start', ['default'], function () {
  return nodemon({
    script: 'dist/server/index.dev.js',
    watch: 'src/server/',
    ignore: [
      'node_modules'
    ],
    nodeArgs: ['--debug', '--max_old_space_size=4096'],
    stdout: false,
    readable: false
  })
        .on('readable', function () {
            // free memory
          bunyan && bunyan.kill()

          var platform = os.platform()
          if (platform === 'win32') {
            bunyan = spawn('cmd', [
              '/s', '/c', 'bunyan', '--output', 'short',
              '--color'
            ])
          } else {
            bunyan = spawn('bunyan', [
              '--output', 'short',
              '--color'
            ])
          }

          bunyan.stdout.pipe(process.stdout)
          bunyan.stderr.pipe(process.stderr)

          this.stdout.pipe(bunyan.stdin)
          this.stderr.pipe(bunyan.stdin)
          bunyan.on('error', function (e) {
            console.error(e)
          })
          return bunyan
        })
})

gulp.task('watch', function () {
  return gulp.watch([srcPath + srcFilePattern], ['babel-server'])
})

gulp.task('default', ['clean-server'], function (cb) {
  return runSequence(['babel-server', 'set-dev-node-env', 'watch'], cb)
})
