(function() {
  var Debug, Drawer, EventEmitter, Graph, Keyboard, Monosynth, NoteList, Sampler, classof, kb;

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
        return this.last.note;
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

    toArray() {
      var arr, it;
      it = this.last;
      arr = [];
      if (it == null) {
        return arr;
      }
      // actually do while
      arr.push(it.note);
      it = it.prev;
      while (it != null) {
        arr.push(it.note);
        it = it.prev;
      }
      arr.reverse();
      return arr;
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
      var fn, j, len, ref, results;
      if (this._events[type] != null) {
        ref = this._events[type];
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          fn = ref[j];
          results.push(fn(...args));
        }
        return results;
      }
    }

  };

  Debug = class Debug {
    constructor(el, lineLimit = 17, widthLimit = 30) {
      this.el = el;
      this.history = [];
      this.widthLimit = widthLimit;
      this.lineLimit = lineLimit;
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
  //  note-on
  //  note-off
  Keyboard = class Keyboard extends EventEmitter {
    constructor(options) {
      var ref;
      super();
      if ((options != null) && (options.debug != null)) {
        this.debug = options.debug;
      }
      this.list = new NoteList();
      this.midi = null;
      this.input = null;
      // setup keyboard
      window.addEventListener('keydown', this.onKeyDown.bind(this));
      window.addEventListener('keyup', this.onKeyUp.bind(this));
      // setup midii
      if (navigator.requestMIDIAccess == null) {
        if ((ref = this.debug) != null) {
          ref.log('midi is not supported');
        }
        return this;
      }
      navigator.requestMIDIAccess().then(this.onMIDISuccess.bind(this), this.onMIDIError.bind(this));
    }

    onMIDIError(e) {
      var ref;
      return (ref = this.debug) != null ? ref.log('midi cannot initialize' + e) : void 0;
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
      if ((ref = this.debug) != null) {
        ref.log(`was found ${count} midi devices`);
      }
      if ((ref1 = this.debug) != null) {
        ref1.log("listening for new connections...");
      }
      return m.onstatechange = this.onMIDIConnection.bind(this);
    }

    onMIDIConnection(e) {
      var p, ref, ref1, ref2, str;
      p = e.port;
      if (p.type === "input" && p.state === "connected" && p.connection === "closed") {
        if ((ref = this.debug) != null) {
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
      if ((ref1 = this.debug) != null) {
        ref1.log('\n');
      }
      return (ref2 = this.debug) != null ? ref2.log(str.join('\n')) : void 0;
    }

    onMIDIMessage(e) {
      var ref, ref1, ref2;
      if ((ref = this.debug) != null) {
        ref.log('recieve midi message');
      }
      if ((ref1 = this.debug) != null) {
        ref1.log(event.data);
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
        case 0xc0:
          if ((ref2 = this.debug) != null) {
            ref2.log('goood condition');
          }
          return this.programChange(event.data[1]);
      }
    }

    noteOn(noteNumber) {
      var ref;
      this.list.appendNote(noteNumber);
      if ((ref = this.debug) != null) {
        ref.log(this.list.toArray());
      }
      this.emit('note-on', noteNumber);
      return this.emit('last-changed', this.list.getLast());
    }

    noteOff(noteNumber) {
      var isLast, ref;
      isLast = this.list.isLast(noteNumber);
      this.list.removeNote(noteNumber);
      if ((ref = this.debug) != null) {
        ref.log(this.list.toArray());
      }
      this.emit('note-off', noteNumber);
      if (isLast) {
        return this.emit('last-changed', this.list.getLast());
      }
    }

    programChange(data) {
      return this.emit('program-change', data);
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

  Monosynth = class Monosynth {
    constructor(options) {
      this.attack = 0;
      this.release = 0;
      this.portamento = 0;
      if (options != null) {
        if (this.attack == null) {
          this.attack = options.attack;
        }
        if (this.release == null) {
          this.release = options.release;
        }
        if (this.portamento == null) {
          this.portamento = options.portamento;
        }
      }
      this.c = new AudioContext();
      this.osc = this.c.createOscillator();
      this.osc.frequency.setValueAtTime(110, 0);
      this.env = this.c.createGain();
      this.env.gain.value = 0.0;
      this.osc.connect(this.env);
      this.env.connect(this.c.destination);
      this.osc.start(0);
    }

    noteToFreq(note) {
      return 440 * Math.pow(2, (note - 57) / 12);
    }

    play(note) {
      if (note != null) {
        console.log('playing ', note);
        console.log(this.noteToFreq(note));
        this.osc.frequency.cancelScheduledValues(0);
        this.osc.frequency.setTargetAtTime(this.noteToFreq(note), 0, this.portamento);
        this.env.gain.cancelScheduledValues(0);
        return this.env.gain.setTargetAtTime(1.0, 0, this.attack);
      } else {
        this.env.gain.cancelScheduledValues(0);
        return this.env.gain.setTargetAtTime(0.0, 0, this.release);
      }
    }

  };

  Graph = class Graph {
    constructor(ctx, canvas, drawer) {
      this.c = ctx;
      this.a = this.c.createAnalyser();
      this.arr = new Uint8Array(this.a.fftSize);
      this.cc = canvas.getContext('2d');
      drawer.on('draw', this.draw.bind(this));
    }

    linear(length, uint) {
      return uint / 255 * length;
    }

    draw() {
      var arr, height, i, j, ref, toX, toY, width;
      this.a.getByteTimeDomainData(this.arr);
      arr = this.arr;
      width = this.cc.canvas.width;
      height = this.cc.canvas.height;
      toX = this.linear.bind(this, width);
      toY = this.linear.bind(this, height);
      this.cc.clearRect(0, 0, width, height);
      this.cc.beginPath();
      this.cc.moveTo(toX(arr[0]), toY(arr[0]));
      for (i = j = 1, ref = arr.length; (1 <= ref ? j < ref : j > ref); i = 1 <= ref ? ++j : --j) {
        this.cc.lineTo(toX(arr[1]), toY(arr[1]));
      }
      this.cc.strokeStyle = "#338866";
      return this.cc.stroke();
    }

  };

  Drawer = class Drawer {
    constructor() {}

  };

  
    // events:
  //   sample-loaded

  // options:
  //   ctx:       AudioContext
  //   sample:    "filepath"
  //   loop:      Boolean     or false 
  //   loopStart: 0..duration or 0
  //   loopEnd:   0..duration or 0
  Sampler = class Sampler extends EventEmitter {
    constructor(options) {
      super();
      if (options == null) {
        console.log('sampler: please supply ctx');
        return;
      }
      if (options.ctx == null) {
        console.log('sampler: ctx is null or undefined');
        return;
      }
      this.c = options.ctx;
      if ((options.sample == null) || 'String' !== classof(options.sample)) {
        console.log('sampler: sample path is not a string');
        return;
      }
      this.samplePath = options.sample;
      this.loop = options.loop || false;
      this.loopStart = options.loopStart || 0;
      this.loopEnd = options.loopEnd || 0;
      this.shiftTable = options.shiftTable || {};
      this.buffer = null;
      this.source = null;
      this.loadSample();
      return this;
    }

    loadSample() {
      return fetch(this.samplePath).then(function(r) {
        return r.arrayBuffer();
      }).then((d) => {
        return this.c.decodeAudioData(d);
      }).then((b) => {
        this.buffer = b;
        return this.emit('sample-loaded');
      }).catch((e) => {
        return this.emit('sample-error', e);
      });
    }

    play(note) {
      var offset;
      console.log("sampler: playing ", note);
      console.log("sampler: buffer duration", this.buffer.duration);
      if (note != null) {
        offset = this.shiftTable[note];
        if (this.source != null) {
          this.source.stop();
        }
        this.source = this.c.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.loop = this.loop;
        this.source.loopStart = this.loopStart;
        this.source.loopEnd = this.loopEnd;
        this.source.connect(this.c.destination);
        if (offset != null) {
          return this.source.start(0, offset);
        } else {
          return this.source.start(0);
        }
      } else {
        if (this.source != null) {
          return this.source.stop();
        }
      }
    }

  };

  window.addEventListener('load', function() {
    var ctx, debug, sampler;
    debug = new Debug(document.getElementById('keyboard-debug'));
    kb = new Keyboard({
      debug: debug
    });
    ctx = new AudioContext();
    sampler = new Sampler({
      ctx: ctx,
      sample: "./samples/pack1/think--all.flac",
      loop: true,
      loopStart: 0,
      loopEnd: 0,
      shiftTable: {}
    });
    sampler.on('sample-error', function(e) {
      return console.log('sampler: error', e.message);
    });
    return sampler.on('sample-loaded', function() {
      var lastPlayedNote, lastProgram;
      console.log('main: sample is loaded!');
      lastPlayedNote = null;
      lastProgram = null;
      kb.on('note-on', function(note) {
        lastPlayedNote = note;
        return sampler.play(note);
      });
      kb.on('note-off', function(note) {
        if (lastPlayedNote === note) {
          return lastPlayedNote = null;
        }
      });
      return kb.on('program-change', function(data) {
        var prev;
        if (lastPlayedNote != null) {
          debug.log('kb: change offset of ' + data);
          prev = sampler.shiftTable[lastPlayedNote];
          if (prev == null) {
            prev = 0;
          }
          sampler.shiftTable[lastPlayedNote] = sampler.buffer.duration / 128 * data;
          return sampler.play(lastPlayedNote);
        }
      });
    });
  });

}).call(this);
