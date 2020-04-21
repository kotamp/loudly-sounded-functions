import EventEmitter from './EventEmitter.js';

export default (function() {  /*
   * events emit:
   *   debug
   *   noteon
   *   noteoff
   *   program-change
   *   keydown.<key>
   *   keyup.<key>
   *
   */
  var Keyboard;
  return Keyboard = class Keyboard extends EventEmitter {
    constructor() {
      super();
      this.midi = null;
      this.input = null;
      this.emit('debug', 'kb: launching...');
      window.addEventListener('keydown', this.keydown.bind(this));
      window.addEventListener('keyup', this.keyup.bind(this));
      // setup midii
      if (navigator.requestMIDIAccess == null) {
        this.emit('debug', 'kb: midi is not supported');
        return this;
      }
      navigator.requestMIDIAccess().then(this.midisuccess.bind(this), this.midierror.bind(this));
    }

    midierror(e) {
      return this.emit('debug', "kb: midi cannot be initialized");
    }

    midisuccess(m) {
      var bound, count, inputs, it;
      this.midi = m;
      inputs = m.inputs.values();
      it = inputs.next();
      bound = this.midimessage.bind(this);
      count = 0;
      while (it && !it.done) {
        it.value.onmidimessage = bound;
        it = inputs.next();
        count++;
      }
      this.emit('debug', `kb: found ${count} midi devices`);
      this.emit('debug', "kb: listening for new connections...");
      return this.midi.onstatechange = this.midiconnection.bind(this);
    }

    midiconnection(e) {
      var debugInfo, p;
      p = e.port;
      debugInfo = [p.id, p.type, p.state, p.connection];
      if (p.manufacturer != null) {
        debugInfo.push(p.manufacturer);
      }
      if (p.name != null) {
        debugInfo.push(p.name);
      }
      if (p.version != null) {
        debugInfo.push(p.version);
      }
      if (p.type === "input" && p.state === "connected" && p.connection === "closed") {
        p.onmidimessage = this.midimessage.bind(this);
        return this.emit('debug', 'kb: setting up listener', ...debugInfo);
      } else {
        return this.emit('debug', 'kb: ignoring device', ...debugInfo);
      }
    }

    midimessage(e) {
      this.emit('debug', 'kb: recieved midi message', event.data);
      switch (event.data[0] & 0xf0) {
        case 0x90:
          if (e.data[2] !== 0) {
            return this.emit('noteon', event.data[1]);
          } else {
            return this.emit('noteoff', event.data[1]);
          }
          break;
        case 0x80:
          return this.emit('noteoff', event.data[1]);
        case 0xc0:
          return this.emit('program-change', event.data[1]);
      }
    }

    keydown(e) {
      this.emit('keydown', e);
      return this.emit(`keydown.${e.code}`, e);
    }

    keyup(e) {
      this.emit('keyup', e);
      return this.emit(`keyup.${e.code}`, e);
    }

  };
})();
