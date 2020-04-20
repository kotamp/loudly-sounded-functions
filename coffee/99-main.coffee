window.addEventListener 'load', ->
  button = document.getElementById 'launch'
  button.removeAttribute 'disabled'

  button.addEventListener 'click', ->
    button.style.display = 'none'
    do init

init = ->
  modeEl = document.getElementById 'mode'
  programChangeHandler = ->
  debug = new Debug
    lineLimit: 20

  eve.on 'debug', ->
    debug.log arguments...

  kb = new Keyboard

  ctx = new AudioContext
  sampler = null

  eve 'debug', null, 'hi'

  eve.on 'sampler.error', (e) ->
    eve 'debug', null, e

  eve.on 'sampler.loaded', ->
    eve 'debug', null,
      'sampler: sample is loaded'
    console.log 'setup listeners'

    lastPlayedNote = null
    lastProgram = null

    eve.on 'midi.note.on', (note) ->
      lastPlayedNote = note
      sampler.play note

    eve.on 'midi.note.off', (note) ->
      if lastPlayedNote == note
        lastPlayedNote = null

    eve.on 'midi.program-change', (data) ->
      if lastPlayedNote?
        eve 'debug', null,
          'kb: change offset of ' + data
        prev = sampler.shiftTable[lastPlayedNote]

        if not prev?
          prev = 0

        sampler.shiftTable[lastPlayedNote] = sampler.buffer.duration / 128 * data
        sampler.play lastPlayedNote


  ###
  sampler = new Sampler
    ctx: ctx
    sample: "./samples/pack1/think--all.flac"
    loop: true
    loopStart: 0
    loopEnd: 0
    shiftTable: {}
  ###

  masterGain = do ctx.createGain
  

  lowpassFilter = do ctx.createBiquadFilter
  lowpassFilter.type = "lowpass"

  gain = do ctx.createGain
  gain.gain.value = 1
  
  polysynth = new Polysynth
    ctx: ctx
    dest: gain

  visual1 = new VisualAnalyser ctx, gain, lowpassFilter



  lowpassFilter.connect masterGain

  eve.on 'midi.note.on', (note) ->
    polysynth.noteOn note

  eve.on 'midi.note.off', (note) ->
    polysynth.noteOff note






  visual = new VisualAnalyser ctx, masterGain,
    ctx.destination

  eve.on 'keyboard.button.m', ->
    modeEl.innerHTML = 'master'
    programChangeHandler = (data) ->
      masterGain.gain
        .cancelAndHoldAtTime 0
        .linearRampToValueAtTime data/127 * 2,
        ctx.currentTime + 0.01,

  eve.on 'keyboard.button.a', ->
    modeEl.innerHTML = 'attack'
    programChangeHandler = (data) ->
      polysynth.attack = data/127 * 5

  eve.on 'keyboard.button.d', ->
    modeEl.innerHTML = 'delay'
    programChangeHandler = (data) ->
      polysynth.delay = data/127 * 5

  eve.on 'keyboard.button.s', ->
    modeEl.innerHTML = 'sustain'
    programChangeHandler = (data) ->
      polysynth.sustain = data/127 * 5

  eve.on 'keyboard.button.r', ->
    modeEl.innerHTML = 'release'
    programChangeHandler = (data) ->
      polysynth.release = data/127 * 5

  eve.on 'midi.program-change', (data) ->
    programChangeHandler data

  Qmin = lowpassFilter.Q.minValue
  Qmax = lowpassFilter.Q.maxValue

  eve.on 'keyboard.button.q', ->
    modeEl.innerHTML = 'filter Q'
    programChangeHandler = (data) ->
      lowpassFilter
        .Q.cancelAndHoldAtTime 0
        .linearRampToValueAtTime (Qmax-Qmin) * data / 127, 5

  freqMin = lowpassFilter.frequency.minValue
  freqMax = lowpassFilter.frequency.maxValue

  eve.on 'keyboard.button.f', ->
    modeEl.innerHTML = 'filter frequency'
    programChangeHandler = (data) ->
      lowpassFilter
        .frequency.cancelAndHoldAtTime 0
        .linearRampToValueAtTime(
          data / 127 * (freqMax-freqMin),
          5
        )




  handler = (time) ->
    eve 'animation.update', null, time
    window.requestAnimationFrame handler
  window.requestAnimationFrame handler

  window.addEventListener 'keydown', (e) ->
    eve 'keyboard.keydown', this, e

  window.addEventListener 'keyup', (e) ->
    eve 'keyboard.keyup', this, e
