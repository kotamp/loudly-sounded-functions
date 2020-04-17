window.addEventListener 'load', ->
  debug = new Debug document.getElementById 'keyboard-debug'
  kb = new Keyboard
    debug: debug

  ctx = new AudioContext
  sampler = new Sampler
    ctx: ctx
    sample: "./samples/pack1/think--all.flac"
    loop: true
    loopStart: 0
    loopEnd: 0
    shiftTable: {}

  sampler.on 'sample-error', (e) ->
    console.log 'sampler: error', e.message

  sampler.on 'sample-loaded', ->
    console.log 'main: sample is loaded!'
    lastPlayedNote = null
    lastProgram = null

    kb.on 'note-on', (note) ->
      lastPlayedNote = note
      sampler.play note

    kb.on 'note-off', (note) ->
      if lastPlayedNote == note
        lastPlayedNote = null

    kb.on 'program-change', (data) ->
      if lastPlayedNote?
        debug.log 'kb: change offset of ' + data
        prev = sampler.shiftTable[lastPlayedNote]

        if not prev?
          prev = 0

        sampler.shiftTable[lastPlayedNote] = sampler.buffer.duration / 128 * data
        sampler.play lastPlayedNote


