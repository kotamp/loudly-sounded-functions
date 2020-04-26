import { clamp } from './utils.js'
import drawer from './drawer.js'

export default do ->
  pi2 = Math.PI * 2
  pi05 = Math.PI * 0.5
  class VisualAnalyser
    constructor: (ctx, src, dest) ->
      @ctx = ctx
      @analyser = do ctx.createAnalyser

      @analyser.fftSize = 512

      @width = window.innerWidth - 16
      @height = 300

      @paper = Snap @width, @height
      @path = @paper.path ""

      @path.attr
        stroke: "#c800ff"
        strokeWidth: "1px"

      src.connect @analyser
      @analyser.connect dest

      @arr = new Float32Array @analyser.fftSize
  
      drawer this.draw.bind this
  
    ny: (y) ->
      (y+1) * @height / 2

    nx: (x) ->
      x / @arr.length * @width

    draw: ->
      @analyser.getFloatTimeDomainData @arr

      p = "M0,#{@ny(@arr[0])}"



      #for i in [1...@arr.length]
      for i in [0...@width] by (@arr.length / @width / window.devicePixelRatio)
        p += "L" + i + "," + @ny(@arr[Math.floor(i)])

      @path.attr d: p
