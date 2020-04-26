import { clamp } from './utils.js'
import drawer from './drawer.js'

export default do ->
  ln20 = Math.log 20
  ln1e3 = 3 * Math.log 10

  class VisualAnalyser
    constructor: (ctx, src, dest) ->
      @ctx = ctx
      @analyser = do ctx.createAnalyser
      @analyser.fftSize = 32768
      @analyser.smoothingTimeConstant = 0.01
      @analyser.minDecibels = -200
      @analyser.maxDecibels = 0
      @width = window.innerWidth - 16
      @height = window.innerHeight
      @paper = Snap @width, @height
      @path = @paper.path ""

      @path.attr
        stroke: "#ffc800"
        strokeWidth: "1px"

  
      src.connect @analyser
      @analyser.connect dest
  
      @arr = new Uint8Array @analyser.frequencyBinCount
      @freqStep = ctx.sampleRate / 2 / @arr.length
  
      drawer this.draw.bind this
  
    normX: (x) ->
      clamp 0,
        @width,
        @width * (Math.log(x)-ln20)/ln1e3

    normY: (y) ->
      @height - y / 255 * @height
  
    draw: ->
      @analyser.getByteFrequencyData @arr
      
      str = "M0,#{@height}"

      for v,i in @arr
        str += "L#{@normX(i*@freqStep)},#{@normY(v)}"

      str += "L#{@width},#{@height}Z"

  

      @path.attr d: str
