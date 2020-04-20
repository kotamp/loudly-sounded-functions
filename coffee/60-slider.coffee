class SliderUI extends EventEmitter
  constructor: (parent, minValue, maxValue, defaultValue) ->
    do super

    @contEl = document.createElement 'div'
    @contEl.setAttribute 'class', 'slider'

    @textEl = document.createElement 'div'
    @textEl.setAttribute 'class', 'text'

    @valueEl = document.createElement 'div'
    @valueEl.setAttribute 'class', 'text'

    @rollerEl = document.createElement 'svg'
    @rollerEl.setAttribute 'class', 'roller'

    @contEl.appendChild @textEl
    @contEl.appendChild @valueEl
    @contEl.appendChild @rollerEl

