gulp = require 'gulp'
concat = require 'gulp-concat'
bs = require('browser-sync').create()
coffee = require 'gulp-coffee'

options =
  coffeeSrc: './coffee/*.coffee'
  jsDest: './js/'
  compiledName: 'compiled.coffee'

serve = (done) ->
  bs.init server: baseDir: './'
  do done

reload = (done) ->
  do bs.reload
  do done

compile = ->
  gulp.src options.coffeeSrc
  .pipe concat options.compiledName
  .pipe do coffee
  .pipe gulp.dest options.jsDest

watch = (done) ->
  gulp.watch options.coffeeSrc, gulp.series compile, reload
  gulp.watch ['./index.html', './lib/**'], reload
  do done

exports.default = gulp.series serve, compile, watch
