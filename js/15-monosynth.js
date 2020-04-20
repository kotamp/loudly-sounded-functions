(function() {
  var Monosynth;

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

}).call(this);
