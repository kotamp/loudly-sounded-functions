# events:
#  last-changed

class Keyboard extends EventEmitter
  constructor: (options) ->
    do super

    if options.debug?
      @_debug = options.debug

    @list = new NoteList
    @midi = null
    @input = null

    # setup keyboard
    window.addEventListener 'keydown',
      this.onKeyDown.bind(this)

    window.addEventListener 'keyup',
      this.onKeyUp.bind(this)

    # setup midii

    if not navigator.requestMIDIAccess?
      @_debug?.log 'midi is not supported'
      return this

    navigator
      .requestMIDIAccess()
      .then this.onMIDISuccess.bind(this),
            this.onMIDIError.bind(this)

  onMIDIError: (e) ->
    @_debug?.log 'midi cannot initialize' + e

  onMIDISuccess: (m) ->
    @midi = m
    inputs = m.inputs.values()
    it = inputs.next()
    bound = this.onMIDIMessage.bind(this)
    count = 0

    while it and not it.done
      it.value.onmidimessage = bound
      it = inputs.next()
      count++

    @_debug?.log "was found #{count} midi devices"
    @_debug?.log "listening for new connections..."

    m.onstatechange = this.onMIDIConnection.bind this

  onMIDIConnection: (e) ->
    p = e.port

    if p.type == "input" and
       p.state == "connected" and
       p.connection == "closed"

      @_debug?.log 'setting up listener'
      p.onmidimessage = this.onMIDIMessage.bind this

    str = []

    str.push p.id, p.type, p.state, p.connection

    if p.manufacturer?
      str.push p.manufacturer

    if p.name?
      str.push p.name

    if p.version?
      str.push p.version

    @_debug?.log '\n'
    @_debug?.log str.join '\n'


  onMIDIMessage: (e) ->
    @_debug?.log 'recieve midi message'
    switch event.data[0] & 0xf0
      when 0x90
        if e.data[2] != 0
          this.noteOn event.data[1]
        else
          this.noteOff event.data[1]
      when 0x80
        this.noteOff event.data[1]

  noteOn: (noteNumber) ->
    @list.appendNote noteNumber
    this.emit 'last-changed', @list.last

  noteOff: (noteNumber) ->
    isLast = @list.isLast noteNumber
    @list.removeNote noteNumber
    if isLast
      this.emit 'last-changed', @list.last



  onKeyDown: (e) ->
    console.log 'down', e

  onKeyUp: (e) ->
    console.log 'up', e

kb = new Keyboard
  debug: new Debug document.getElementById 'keyboard-debug'
kb.on 'last-changed', (note) ->
  console.log 'last note', note
console.log 'keyboard is listened'
