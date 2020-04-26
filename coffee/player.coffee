import Visualizer from './VCircle.js'

do ->
  window.addEventListener 'load', ->
    b = document.getElementById 'launch'
    b.removeAttribute 'disabled'
    b.addEventListener 'click', ->
      b.style.display = 'none'
      filePicker = document.getElementById 'myfile'
      audioEl = document.getElementById 'audio'

      ctx = new AudioContext

      filePicker.addEventListener 'change', (e)->
        if e.target.files.length > 0
          audio.setAttribute 'src',
            URL.createObjectURL e.target.files[0]

      mediaSrc = ctx.createMediaElementSource audioEl

      vi = new Visualizer ctx, mediaSrc, ctx.destination
