import EventEmitter from './EventEmitter.js'

export default do ->
  bg =
    1: "#990066"
    2: "#333366"
    3: "#333366"
    4: "#003355"
    5: "#009966"
    6: "#003300"
    7: "#669900"
    8: "#666600"
    0: "#996633"

  class BeatView extends EventEmitter
    constructor: (parent, color, isOn) ->
      do super

      @el = document.createElement 'div'
      parent.appendChild @el
      @selected = isOn
      @color = color

      @el.style.color = "white"
      @el.style.backgroundColor = if @selected then @color else "black"
      @listener = (e) =>
        @emit "click"

      @el.addEventListener "click", @listener

    clean: ->
      @el.removeEventListener "click", @listener
      @el.remove()
      

    update: (isOn) ->
      if isOn != @selected
        @selected = isOn
        @el.style.backgroundColor = if @selected then @color else "black"
        


  class BeatMachineView
    constructor: (model) ->
      @model = model
      @el = document.createElement 'div'
      document.body.appendChild @el
      console.log document.body

      @beats = []
      @rows = []

      @rr = rr = @model.minibeats
      @cc = cc = 9

      for r in [0...rr]
        beats = []
        @beats.push beats

        row = document.createElement 'div'
        row.setAttribute 'class', 'beat-row'
        @rows.push row
        @el.appendChild row

        for c in [0...9]
          beats.push new BeatView row, bg[c], off

      @update()
      console.log @rows

    update: ->
      for r in [0...@rr]
        if @model.timings[r]?
          ti = @model.timings[r].get()
          for c in [0...@cc]
            @beats[r][c].update ti.indexOf(c+1) != -1



              




