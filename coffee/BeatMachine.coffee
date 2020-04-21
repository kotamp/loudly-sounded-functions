import EventEmitter from './EventEmitter.js'
import Sample from './Sample.js'
import rand from './rand.js'
import Set from './Set.js'
import classof from './classof.js'

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
      @bpm = options.bpm or 144
      @minibeats = options.minibeats or 128
      @solidbeats = options.solidbeats or 4
      @metronome = options.metronome or null

      @samples = []
      @timings = {}
      @playing = new Set

      @count =
        bound: 0
        mustBeAhead: 1

      @startTime = 0
      @barDuration = 60 * 4 / @bpm

    start: ->
      console.log 'start!'
      @startTime = @ctx.currentTime
      console.log @ctx.currentTime
      console.log @startTime
      do @update

    update: ->
      console.log 'updating'
      time = @ctx.currentTime

      @count.played = Math.ceil(
        (time - @startTime) / @barDuration
      )

      needToSetup = @count.mustBeAhead -
        (@count.bound - @count.played)

      ###
      console.log 'bound:', @count.bound
      console.log 'played: ', @count.played
      console.log 'will setup', needToSetup
      console.log 'duration', @barDuration
      ###

      for i in [0...needToSetup]
        t = (@count.bound + i) * @barDuration
        console.log @ctx.currentTime, t
        @setupBarSince t

      @count.bound = @count.bound + needToSetup

    setupBarSince: (time) ->
      if @metronome?
        @setupMetronome(time)

      for k,v of @timings
        console.log k, v
        shift = @barDuration / @minibeats  * (+k)
        console.log shift, @barDuration, @minibeats
        for index in v.get()
          @playing.add(
            @samples[index]
            .play @dest, time+shift, (e) =>
              @playing.remove e.target
          )

    setupMetronome: (time) ->
      if not (@metronome instanceof Sample)
        throw new Error 'beat machine: metronome sample is not an instance of Sample class. It\'s ' + classof(@metronome)
      step = @minibeats // @solidbeats
      for i in [0...@minibeats] by step
        shift = @barDuration / @minibeats * (+i)
        @playing.add(
          @metronome.play @dest,
            time+shift, (e) =>
              @playing.remove e.target
        )

    setSampleNow: (sample) ->
      currentTime = @ctx.currentTime - 0.1
      startTime = @startTime

      offset = (currentTime - startTime) %
               @barDuration / @barDuration

      console.log 'hello'
      console.log currentTime
      console.log startTime
      console.log @barDuration
      console.log offset

      index = Math.floor @minibeats * offset



      @timings[index] ?= new Set
      @timings[index].add sample
      
    resetSample: (sample) ->
      for k in Object.keys(@timings)
        @timings[k].remove sample

