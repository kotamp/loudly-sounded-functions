import EventEmitter from './EventEmitter.js'

export default do ->
  class UIRoller extends EventEmitter
    constructor: (defaultValue, min, max, step, label) ->
      do super

      @min = min
      @max = max
      @step = step
    
      @container = document.createElement 'div'
      @container.setAttribute 'class', 'roller'
      document.body.appendChild @container

      window.addEventListener 'wheel',
        this.onwheel.bind this

      @container.addEventListener 'hover',
        this.onhover.bind this

      @label = document.createTextNode label
      @text = document.createElement 'span'
      @text.innerHTML = defaultValue.toFixed(2)

      @container.appendChild @label
      @container.appendChild @text

    onwheel: (e) ->
      e.preventDefault()
      alert('wheel')
      console.log e.deltaY, e.deltaZ, e.deltaX

    onhover: (e)->
      alert 'hover'

