(function() {
  // events:
  //  last-changed
  //  note-on
  //  note-off
  var Keyboard;

  Keyboard = class Keyboard extends EventEmitter {
    constructor(options) {
      super();
      this.list = new NoteList();
      this.midi = null;
      this.input = null;
      eve('debug', null, 'Keyboard is launching...');
      // setup keyboard
      eve.on('keyboard.keydown', this.onKeyDown.bind(this));
      eve.on('keyboard.keyup', this.onKeyUp.bind(this));
      // setup midii
      if (navigator.requestMIDIAccess == null) {
        eve('debug', null, 'midi is not supported');
        return this;
      }
      navigator.requestMIDIAccess().then(this.onMIDISuccess.bind(this), this.onMIDIError.bind(this));
    }

    onMIDIError(e) {
      return eve('debug', null, 'midi cannot be initialized', e);
    }

    onMIDISuccess(m) {
      var bound, count, inputs, it;
      this.midi = m;
      inputs = m.inputs.values();
      it = inputs.next();
      bound = this.onMIDIMessage.bind(this);
      count = 0;
      while (it && !it.done) {
        it.value.onmidimessage = bound;
        it = inputs.next();
        count++;
      }
      eve('debug', null, `was found ${count} midi devices`);
      eve('debug', null, "listening for new connections...");
      return m.onstatechange = this.onMIDIConnection.bind(this);
    }

    onMIDIConnection(e) {
      var p, str;
      p = e.port;
      if (p.type === "input" && p.state === "connected" && p.connection === "closed") {
        eve('debug', null, 'setting up listener');
        p.onmidimessage = this.onMIDIMessage.bind(this);
      }
      str = [];
      str.push(p.id, p.type, p.state, p.connection);
      if (p.manufacturer != null) {
        str.push(p.manufacturer);
      }
      if (p.name != null) {
        str.push(p.name);
      }
      if (p.version != null) {
        str.push(p.version);
      }
      eve('debug', null, '\n');
      return eve('debug', null, str.join('\n'));
    }

    onMIDIMessage(e) {
      eve('debug', null, 'recieve midi message');
      eve('debug', null, event.data);
      switch (event.data[0] & 0xf0) {
        case 0x90:
          if (e.data[2] !== 0) {
            return this.noteOn(event.data[1]);
          } else {
            return this.noteOff(event.data[1]);
          }
          break;
        case 0x80:
          return this.noteOff(event.data[1]);
        case 0xc0:
          return this.programChange(event.data[1]);
      }
    }

    noteOn(noteNumber) {
      this.list.appendNote(noteNumber);
      eve('debug', null, "pressed notes", this.list.toArray());
      eve('midi.note.on', this, noteNumber);
      return eve('midi.last-changed', this, this.list.getLast());
    }

    noteOff(noteNumber) {
      var isLast;
      isLast = this.list.isLast(noteNumber);
      this.list.removeNote(noteNumber);
      eve('debug', null, this.list.toArray());
      eve('midi.note.off', this, noteNumber);
      if (isLast) {
        return eve('midi.last-changed', this, this.list.getLast());
      }
    }

    programChange(data) {
      return eve('midi.program-change', this, data);
    }

    onKeyDown(e) {
      console.log(e.key);
      return eve(`keyboard.button.${e.key}`, null);
    }

    onKeyUp(e) {
      return console.log('up', e);
    }

  };

}).call(this);
