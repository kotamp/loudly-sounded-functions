import EventEmitter from './EventEmitter.js'

###
# events emit:
#   debug
#   noteon
#   noteoff
#   program-change
#   keydown.<key>
#   keyup.<key>
#
###

export default do ->
  class Keyboard extends EventEmitter
    constructor: ->
      do super

      @midi = null
      @input = null

      @emit 'debug',
        'kb: launching...'

      window.addEventListener 'keydown',
        this.keydown.bind this

      window.addEventListener 'keyup',
        this.keyup.bind this

      # setup midii

      if not navigator.requestMIDIAccess?
        @emit 'debug',
          'kb: midi is not supported'
        return this

      navigator.requestMIDIAccess()
      .then this.midisuccess.bind(this),
            this.midierror.bind(this)

    midierror: (e) ->
      @emit 'debug',
        "kb: midi cannot be initialized"
  
    midisuccess: (m) ->
      @midi = m
      inputs = do m.inputs.values
      it = do inputs.next
      bound = this.midimessage.bind this
      count = 0
  
      while it and not it.done
        it.value.onmidimessage = bound
        it = inputs.next()
        count++
  
      @emit 'debug',
        "kb: found #{count} midi devices"
      @emit 'debug',
        "kb: listening for new connections..."
  
      @midi.onstatechange = this.midiconnection.bind this
  
    midiconnection: (e) ->
      p = e.port
  
      debugInfo = [
        p.id
        p.type
        p.state
        p.connection
      ]
  
      if p.manufacturer?
        debugInfo.push p.manufacturer
  
      if p.name?
        debugInfo.push p.name
  
      if p.version?
        debugInfo.push p.version
  
      if p.type == "input" and
         p.state == "connected" and
         p.connection == "closed"
  
        p.onmidimessage = this.midimessage.bind this
        @emit 'debug',
          'kb: setting up listener',
          debugInfo...
      else
        @emit 'debug',
          'kb: ignoring device',
          debugInfo...
  
    midimessage: (e) ->
      @emit 'debug',
        'kb: recieved midi message',
        event.data
  
      switch event.data[0] & 0xf0
        when 0x90
          if e.data[2] != 0
            @emit 'noteon', event.data[1]
          else
            @emit 'noteoff', event.data[1]
        when 0x80
          @emit 'noteoff', event.data[1]
        when 0xc0
          @emit 'program-change', event.data[1]
  
    keydown: (e) ->
      @emit 'keydown', e
      @emit "keydown.#{e.key}", e
  
    keyup: (e) ->
      @emit 'keyup', e
      @emit "keyup.#{e.key}", e
