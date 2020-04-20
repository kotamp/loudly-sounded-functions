gulp = require 'gulp'
bs = require('browser-sync').create()
coffee = require 'gulp-coffee'
concat = require 'gulp-concat'
uglify = require 'gulp-uglify'
eslint = require 'gulp-eslint'

options =
  src: './coffee/**.coffee'
  dest: './js/'

serve = (done) ->
  bs.init server: baseDir: './'
  do done

reload = (done) ->
  do bs.reload
  do done

compile = ->
  gulp.src options.src
  .pipe do coffee
  .pipe gulp.dest options.dest

lint = ->
  gulp.src ['**/*.js', '!node_modules/**']
  .pipe eslint
    extends: "eslint:recommended"
    envs: [ 'browser' ]
  .pipe eslint.formatEach 'compact', process.stderr

watch = (done) ->
  gulp.watch options.src,
    gulp.series compile, reload
  gulp.watch ['./index.html', './lib/**'], reload
  do done

exports.default = gulp.series serve, compile, watch
