class Debug
  constructor: (options) ->
    @el = document.createElement 'pre'
    @el.style.padding = '5px'
    @el.style.backgroundColor = '#886633'
    @el.style.fontSize = '20px'
    document.body.appendChild @el


    @history = []
    @widthLimit = options?.widthLimit or 30
    @lineLimit = options?.lineLimit or 17

  log: ->
    @history.push(
      Array.prototype.map.call(
        arguments,
        (e) -> e.toString().split('\n'))...)
    @history = @history.slice -@lineLimit
    @el.innerHTML = @history.join '\n'
