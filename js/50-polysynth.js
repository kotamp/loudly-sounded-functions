(function() {
  var Polysynth;

  Polysynth = class Polysynth extends EventEmitter {
    constructor(options) {
      if (options == null) {
        eve('debug', null, 'polysynth: no options');
        return false;
      }
      if (options.ctx == null) {
        eve('debug', null, 'polysynth: no options.ctx');
        return false;
      }
      if (options.dest == null) {
        eve('debug', null, 'polysynth: no options.dest');
        return false;
      }
      /*
      if not options.generator?
        eve 'debug', null,
          'polysynth: no options.generator'
          */
      super();
      this.ctx = options.ctx;
      this.dest = options.dest;
      this.attack = options.attack || 0.05;
      this.delay = options.delay || 0.05;
      this.sustain = options.sustain || 0.5;
      this.release = options.release || 0.05;
      this.set = {};
      return this;
    }

    noteOn(note) {
      var o;
      if (this.set[note] == null) {
        o = this.set[note] = {
          osc: this.ctx.createOscillator(),
          env: this.ctx.createGain()
        };
        o.osc.frequency.value = noteToFreq(note);
        o.env.gain.setValueAtTime(0, 0);
        o.osc.connect(o.env);
        o.env.connect(this.dest);
        o.osc.start();
      }
      return this.set[note].env.gain.cancelAndHoldAtTime(0).linearRampToValueAtTime(1, this.ctx.currentTime + this.attack).linearRampToValueAtTime(this.sustain, this.ctx.currentTime + this.attack + this.delay);
    }

    noteOff(note) {
      if (this.set[note] != null) {
        return this.set[note].env.gain.cancelAndHoldAtTime(0).linearRampToValueAtTime(0, this.ctx.currentTime + this.release);
      }
    }

  };

}).call(this);
