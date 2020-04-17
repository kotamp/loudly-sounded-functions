class Monosynth
  constructor: (options) ->
    @attack = 0
    @release = 0
    @portamento = 0

    if options?
      @attack ?= options.attack
      @release ?= options.release
      @portamento ?= options.portamento

    @c = new AudioContext
    @osc = do @c.createOscillator
    @osc.frequency.setValueAtTime 110, 0

    @env = do @c.createGain
    @env.gain.value = 0.0

    @osc.connect @env
    @env.connect @c.destination

    @osc.start 0

  noteToFreq: (note) ->
    440 * Math.pow 2, (note-57)/12

  play: (note) ->
    if note?
      console.log 'playing ', note
      console.log this.noteToFreq(note)
      @osc.frequency.cancelScheduledValues 0
      @osc.frequency.setTargetAtTime this.noteToFreq(note), 0, @portamento
      @env.gain.cancelScheduledValues 0
      @env.gain.setTargetAtTime 1.0, 0, @attack
    else
      @env.gain.cancelScheduledValues 0
      @env.gain.setTargetAtTime 0.0, 0, @release


