import EventEmitter from './EventEmitter.js'

export default do ->
  class Sample extends EventEmitter
    constructor: (ctx) ->
      console.log 'init sample'
      do super

      if not ctx?
        throw new Error 'sample: ctx is not providen'

      @ctx = ctx
      @buffer = null
      @path = ''

      return @
   
    loadSample: ->

      try
        res = await fetch @path
        ab = await res.arrayBuffer()
        @buffer = await @ctx.decodeAudioData ab
        @emit 'loaded', this
      catch e
        @emit 'error', e

    createNode: ->
      src = @ctx.createBufferSource
      src.buffer = @buffer
      return src
