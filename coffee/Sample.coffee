import EventEmitter from './EventEmitter.js'

export default do ->
  class Sample extends EventEmitter
    constructor: (ctx) ->
      do super

      if not ctx?
        throw new Error 'sample: ctx is not providen'

      @ctx = ctx
      @buffer = null
      @offset = undefined
      @duration = undefined
      @loop = false
      @loopStart = 0
      @loopEnd = 0
      return @
   
    loadSample: (path) ->
      try
        res = await fetch path
        ab = await res.arrayBuffer()
        @buffer = await @ctx.decodeAudioData ab
        @emit 'loaded', this
      catch e
        @emit 'error', e

    play: (dest, _when) ->
      if not @buffer? then return null
      switch arguments.length
        when 3
          onended = arguments[2]
        when 4
          offset = arguments[2]
          onended = arguments[3]
        when 5
          offset = arguments[2]
          duration = arguments[3]
          onended = arguments[4]
      console.log dest, _when, offset, duration, onended?

      src = do @ctx.createBufferSource
      src.buffer = @buffer
      src.loop = @loop
      src.loopStart = @loopStart
      src.loopEnd = @loopEnd

      src.connect dest

      if onended?
        src.onended = onended

      src.start _when, offset or @offset, duration or @duration

      return src
