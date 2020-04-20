import EventEmitter from './EventEmitter.js'
import Keyboard from './Keyboard.js'
import BeatMachine from './BeatMachine.js'

console.log 'init'
window.addEventListener 'load', ->
  button = document.getElementById 'launch'
  console.log button
  
  button.removeAttribute 'disabled'
  button.addEventListener 'click', ->
    button.style.display = 'none'
    kb = new Keyboard
    
    
    
    kb.on 'debug', ->
      console.log arguments...
    
    kb.on 'keydown', (e) ->
      do e.preventDefault
      console.log e.charCode, e.code, e.key, e.keyCode, e.location, e.repeat
      console.log performance.now()

    ctx = new AudioContext
    master = ctx.createGain()
    master.gain.value = 1
    master.connect ctx.destination

    bm = new BeatMachine
      ctx: ctx
      dest: master


    bm.on 'loaded', ->
      bm.setupMetronome()
      do bm.start
      setInterval (-> do bm.update), 1000


