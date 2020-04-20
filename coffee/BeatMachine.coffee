import EventEmitter from './EventEmitter.js'
import Sample from './Sample.js'

export default do ->
  class BeatMachine extends EventEmitter
    constructor: (options) ->
      if not options?
        throw new Error 'bm: options is not providen'

      if not options.ctx?
        throw new Error 'bm: options.ctx is not providen'

      if not options.dest?
        throw new Error 'bm: options.dest is not providen'

      do super
     
      @ctx = options.ctx
      @dest = options.dest
      @bpm = options.bpm or 90
      @minibeats = options.minibeats or 16
      @solidbeats = options.solidbeats or 4

      metronome = new Sample @ctx
      metronome.path = './samples/metronomes/ableton-metronome.wav'

      metronome.on 'loaded', =>
        console.log 'loaded!'
        @emit 'loaded', this

      metronome.on 'error', (e) =>
        console.log e.message

      metronome.loadSample()

      @samples = [metronome]
      @timings = {}
      @startTime = 0
      @countBinded = 0
      @countMustReserved = 4
      @barDuration = 60 * 4 / @bpm


    setupMetronome: ->
      step = @minibeats // @solidbeats
      for i in [0...@minibeats] by step
        @timings[i] ?= []
        @timings[i].push 0

    removeMetronome: ->
      step = @minibeats // @solidbeats
      for i in [0...@minibeats] by step
        @timings[i] ?= []
        @timings[i] = @timings[i].filter (e) ->
          e != 0

    start: ->
      @startTime = @ctx.currentTime
      do @update

    update: ->
      time = @ctx.currentTime
      console.log 'update',time,@countBinded
      countPast = Math.ceil((time - @startTime) / @barDuration)

      console.log countPast, @barDuration
      countSetup = @countMustReserved -
                   @countBinded +
                   countPast

      console.log @countMustReserved, countSetup,@countBinded

      for i in [0...countSetup]
        t = (@countBinded + i) * @barDuration
        @setupBarSince t

      @countBinded = @coundBinded + countSetup

    setupBarSince: (time) ->
      for k,v in @timings
        shift = @barDuration / @minibeats  * (+k)
        for index in v
          node = @samples[index].createNode()
          node.connect @dest
          node.start(time+shift)
           


        

