class Polysynth extends EventEmitter
  constructor: (options) ->
    if not options?
      eve 'debug', null, 'polysynth: no options'
      return false

    if not options.ctx?
      eve 'debug', null,
        'polysynth: no options.ctx'
      return false

    if not options.dest?
      eve 'debug', null,
        'polysynth: no options.dest'
      return false



    
    ###
    if not options.generator?
      eve 'debug', null,
        'polysynth: no options.generator'
        ###
    do super

    @ctx = options.ctx
    @dest = options.dest

    @attack = options.attack or 0.05
    @delay  = options.delay  or 0.05
    @sustain = options.sustain or 0.5
    @release = options.release or 0.05

    @set = {}
    return this
 
  noteOn: (note) ->
    if not @set[note]?
      o = @set[note] =
        osc: do @ctx.createOscillator
        env: do @ctx.createGain

      o.osc.frequency.value = noteToFreq note
      o.env.gain.setValueAtTime 0, 0
      o.osc.connect o.env
      o.env.connect @dest
      o.osc.start()
    
    @set[note].env.gain
      .cancelAndHoldAtTime 0
      .linearRampToValueAtTime 1,
        @ctx.currentTime + @attack
      .linearRampToValueAtTime @sustain,
        @ctx.currentTime + @attack + @delay

  noteOff: (note) ->
    if @set[note]?
      @set[note].env.gain
        .cancelAndHoldAtTime 0
        .linearRampToValueAtTime 0,
          @ctx.currentTime + @release
          






      


