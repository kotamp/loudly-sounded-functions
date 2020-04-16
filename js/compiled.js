(function() {
  var Debug, EventEmitter, Keyboard, NoteList, classof, kb;

  classof = function(o) {
    return Object.prototype.toString.call(o).slice(8, -1);
  };

  NoteList = class NoteList {
    constructor() {
      this.list = {};
      this.last = null;
    }

    getLast() {
      if (this.last != null) {
        return this.last.key;
      } else {
        return null;
      }
    }

    appendNote(note) {
      var o;
      if (this.list[note] == null) {
        o = this.list[note] = {
          prev: this.last,
          next: null,
          note: note
        };
        if (this.last != null) {
          this.last.next = o;
        }
        return this.last = o;
      }
    }

    removeNote(note) {
      var o;
      o = this.list[note];
      if (o != null) {
        if (o.prev != null) {
          o.prev.next = o.next;
        }
        if (o.next != null) {
          o.next.prev = o.prev;
        } else {
          this.last = o.prev;
        }
        return delete this.list[note];
      }
    }

    isLast(note) {
      return this.list[note] === this.last;
    }

  };

  EventEmitter = class EventEmitter {
    constructor() {
      this._events = {};
    }

    on(type, listener) {
      if (this._events[type] == null) {
        this._events[type] = [];
      }
      return this._events[type].push(listener);
    }

    emit(type, ...args) {
      var fn, i, len, ref, results;
      if (this._events[type] != null) {
        ref = this._events[type];
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          fn = ref[i];
          results.push(fn(...args));
        }
        return results;
      }
    }

  };

  Debug = class Debug {
    constructor(el, lineLimit = 30, widthLimit = 30) {
      this.el = el;
      this.history = [];
      this.widthLimit = widthLimit;
    }

    log(o) {
      console.log(o);
      this.history.push(o.toString());
      this.history = this.history.slice(-this.lineLimit);
      return this.el.innerHTML = this.history.join('\n');
    }

  };

  // events:
  //  last-changed
  Keyboard = class Keyboard extends EventEmitter {
    constructor(options) {
      var ref;
      super();
      if (options.debug != null) {
        this._debug = options.debug;
      }
      this.list = new NoteList();
      this.midi = null;
      this.input = null;
      // setup keyboard
      window.addEventListener('keydown', this.onKeyDown.bind(this));
      window.addEventListener('keyup', this.onKeyUp.bind(this));
      // setup midii
      if (navigator.requestMIDIAccess == null) {
        if ((ref = this._debug) != null) {
          ref.log('midi is not supported');
        }
        return this;
      }
      navigator.requestMIDIAccess().then(this.onMIDISuccess.bind(this), this.onMIDIError.bind(this));
    }

    onMIDIError(e) {
      var ref;
      return (ref = this._debug) != null ? ref.log('midi cannot initialize' + e) : void 0;
    }

    onMIDISuccess(m) {
      var bound, count, inputs, it, ref, ref1;
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
      if ((ref = this._debug) != null) {
        ref.log(`was found ${count} midi devices`);
      }
      if ((ref1 = this._debug) != null) {
        ref1.log("listening for new connections...");
      }
      return m.onstatechange = this.onMIDIConnection.bind(this);
    }

    onMIDIConnection(e) {
      var p, ref, ref1, ref2, str;
      p = e.port;
      if (p.type === "input" && p.state === "connected" && p.connection === "closed") {
        if ((ref = this._debug) != null) {
          ref.log('setting up listener');
        }
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
      if ((ref1 = this._debug) != null) {
        ref1.log('\n');
      }
      return (ref2 = this._debug) != null ? ref2.log(str.join('\n')) : void 0;
    }

    onMIDIMessage(e) {
      var ref;
      if ((ref = this._debug) != null) {
        ref.log('recieve midi message');
      }
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
      }
    }

    noteOn(noteNumber) {
      this.list.appendNote(noteNumber);
      return this.emit('last-changed', this.list.last);
    }

    noteOff(noteNumber) {
      var isLast;
      isLast = this.list.isLast(noteNumber);
      this.list.removeNote(noteNumber);
      if (isLast) {
        return this.emit('last-changed', this.list.last);
      }
    }

    onKeyDown(e) {
      return console.log('down', e);
    }

    onKeyUp(e) {
      return console.log('up', e);
    }

  };

  kb = new Keyboard({
    debug: new Debug(document.getElementById('keyboard-debug'))
  });

  kb.on('last-changed', function(note) {
    return console.log('last note', note);
  });

  console.log('keyboard is listened');

}).call(this);
