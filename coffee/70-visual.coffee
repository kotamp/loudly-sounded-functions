clamp = (min, max, val) ->
  if val < min
    return min
  if val > max
    return max
  return val

ln20 = Math.log 20
ln1e3 = 3 * Math.log 10
class VisualAnalyser
  constructor: (ctx, src, dest) ->
    @ctx = ctx
    @analyser = do ctx.createAnalyser

    src.connect @analyser
    @analyser.connect dest

    @arr = new Uint8Array @analyser.frequencyBinCount
    @freqStep = ctx.sampleRate / 2 / @arr.length
   
    @canvas = document.createElement 'canvas'
    @canvas.width = window.innerWidth - 16
    @canvas.height = 200
    document.body.appendChild @canvas

    @cc = @canvas.getContext '2d'

    eve.on 'animation.update', this.draw.bind this

  normX: (x) ->
    return clamp(0, @canvas.width, @canvas.width*(Math.log(x) - ln20) / ln1e3)

  normY: (y) ->
    return @canvas.height - y / 255 * @canvas.height

  draw: ->
    @analyser.getByteFrequencyData @arr
    
    @cc.clearRect 0, 0,
      @canvas.width,
      @canvas.height

    @cc.beginPath()

    @cc.moveTo 0, @normY @arr[0]
    for v,i in @arr[1..]
      @cc.lineTo @normX(i*@freqStep), @normY(v)

    @cc.strokeStyle = "#ffb800"
    @cc.lineWidth = 1
    @cc.stroke()


