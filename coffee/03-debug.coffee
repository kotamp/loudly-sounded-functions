class Debug
  constructor: (el, lineLimit = 17, widthLimit = 30) ->
    @el = el
    @history = []
    @widthLimit = widthLimit
    @lineLimit = lineLimit

  log: (o) ->
    console.log o
    @history.push o.toString()
    @history = @history.slice -@lineLimit
    @el.innerHTML = @history.join '\n'

