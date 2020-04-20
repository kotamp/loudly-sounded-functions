# events:
#  last-changed
#  note-on
#  note-off

class Keyboard extends EventEmitter
  constructor: (options) ->
    do super

    @list = new NoteList
    @midi = null
    @input = null

    eve(
      'debug',
      null,
      'Keyboard is launching...')


    # setup keyboard
    eve.on(
      'keyboard.keydown',
      this.onKeyDown.bind(this))

    eve.on(
      'keyboard.keyup',
      this.onKeyUp.bind(this))

    # setup midii

    if not navigator.requestMIDIAccess?
      eve 'debug', null, 'midi is not supported'
      return this

    navigator
      .requestMIDIAccess()
      .then this.onMIDISuccess.bind(this),
            this.onMIDIError.bind(this)

  onMIDIError: (e) ->
    eve(
      'debug',
      null,
      'midi cannot be initialized',
      e)

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

    eve(
      'debug',
      null,
      "was found #{count} midi devices")

    eve(
      'debug',
      null,
      "listening for new connections...")

    m.onstatechange = this.onMIDIConnection.bind this

  onMIDIConnection: (e) ->
    p = e.port

    if p.type == "input" and
       p.state == "connected" and
       p.connection == "closed"

      eve(
        'debug',
        null,
        'setting up listener')

      p.onmidimessage = this.onMIDIMessage.bind this

    str = []

    str.push p.id, p.type, p.state, p.connection

    if p.manufacturer?
      str.push p.manufacturer

    if p.name?
      str.push p.name

    if p.version?
      str.push p.version

    eve 'debug', null, '\n'
    eve 'debug', null, str.join '\n'


  onMIDIMessage: (e) ->
    eve('debug',null,'recieve midi message')
    eve('debug',null, event.data)

    switch event.data[0] & 0xf0
      when 0x90
        if e.data[2] != 0
          this.noteOn event.data[1]
        else
          this.noteOff event.data[1]
      when 0x80
        this.noteOff event.data[1]
      when 0xc0
        this.programChange event.data[1]

  noteOn: (noteNumber) ->
    @list.appendNote noteNumber

    eve(
      'debug',
      null,
      "pressed notes",
      @list.toArray())

    eve(
      'midi.note.on'
      this,
      noteNumber)

    eve(
      'midi.last-changed',
      this,
      @list.getLast())

  noteOff: (noteNumber) ->
    isLast = @list.isLast noteNumber
    @list.removeNote noteNumber
    
    eve(
      'debug',
      null,
      @list.toArray())

    eve(
      'midi.note.off',
      this,
      noteNumber)

    if isLast
      eve(
        'midi.last-changed',
        this,
        @list.getLast())

  programChange: (data) ->
    eve(
      'midi.program-change',
      this,
      data)

  onKeyDown: (e) ->
    console.log e.key
    eve "keyboard.button.#{e.key}", null

  onKeyUp: (e) ->
    console.log 'up', e

