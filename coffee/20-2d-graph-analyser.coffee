class Graph
  constructor: (ctx, canvas, drawer) ->
    @c = ctx
    @a = do @c.createAnalyser
    @arr = new Uint8Array @a.fftSize

    @cc = canvas.getContext '2d'

    drawer.on 'draw', this.draw.bind this

  linear: (length, uint) ->
    uint / 255 * length

  draw: ->
    @a.getByteTimeDomainData @arr
    arr = @arr

    width = @cc.canvas.width
    height = @cc.canvas.height

    toX = this.linear.bind(this, width)
    toY = this.linear.bind(this, height)

    @cc.clearRect(
      0, 0,
      width, height)
    
    @cc.beginPath()
    @cc.moveTo toX(arr[0]), toY(arr[0])

    for i in [1...arr.length]
      @cc.lineTo toX(arr[1]), toY arr[1]

    @cc.strokeStyle = "#338866"
    @cc.stroke()
