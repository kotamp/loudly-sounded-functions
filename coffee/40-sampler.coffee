# events:
#   sample-loaded
#
# options:
#   ctx:       AudioContext
#   sample:    "filepath"
#   loop:      Boolean     or false 
#   loopStart: 0..duration or 0
#   loopEnd:   0..duration or 0
class Sampler extends EventEmitter
  constructor: (options) ->
    do super

    if not options?
      console.log 'sampler: please supply ctx'
      return

    if not options.ctx?
      console.log 'sampler: ctx is null or undefined'
      return

    @c = options.ctx

    if not options.sample? or
       'String' != classof options.sample
      console.log 'sampler: sample path is not a string'
      return
    
    @samplePath = options.sample
    @loop = options.loop or false
    @loopStart = options.loopStart or 0
    @loopEnd = options.loopEnd or 0

    @shiftTable = options.shiftTable or {}

    @buffer = null
    @source = null

    @loadSample()

    return this

  loadSample: ->
    fetch(@samplePath)
      .then (r) -> r.arrayBuffer()
      .then (d) => @c.decodeAudioData d
      .then (b) =>
        @buffer = b
        @emit 'sample-loaded'
      .catch (e) =>
        @emit 'sample-error', e

  play: (note) ->
    console.log "sampler: playing ", note
    console.log "sampler: buffer duration", @buffer.duration
    if note?
      offset = @shiftTable[note]
      
      if @source?
        do @source.stop

      @source = @c.createBufferSource()

      @source.buffer = @buffer
      @source.loop = @loop
      @source.loopStart = @loopStart
      @source.loopEnd = @loopEnd

      @source.connect @c.destination
      if offset?
        @source.start 0, offset
      else
        @source.start 0
    else
      if @source?
        do @source.stop


      
