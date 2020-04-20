import EventEmitter from './EventEmitter.js';

import Sample from './Sample.js';

export default (function() {
  var BeatMachine;
  return BeatMachine = class BeatMachine extends EventEmitter {
    constructor(options) {
      var metronome;
      if (options == null) {
        throw new Error('bm: options is not providen');
      }
      if (options.ctx == null) {
        throw new Error('bm: options.ctx is not providen');
      }
      if (options.dest == null) {
        throw new Error('bm: options.dest is not providen');
      }
      super();
      this.ctx = options.ctx;
      this.dest = options.dest;
      this.bpm = options.bpm || 90;
      this.minibeats = options.minibeats || 16;
      this.solidbeats = options.solidbeats || 4;
      metronome = new Sample(this.ctx);
      metronome.path = './samples/metronomes/ableton-metronome.wav';
      metronome.on('loaded', () => {
        console.log('loaded!');
        return this.emit('loaded', this);
      });
      metronome.on('error', (e) => {
        return console.log(e.message);
      });
      metronome.loadSample();
      this.samples = [metronome];
      this.timings = {};
      this.startTime = 0;
      this.countBinded = 0;
      this.countMustReserved = 4;
      this.barDuration = 60 * 4 / this.bpm;
    }

    setupMetronome() {
      var base, i, j, ref, ref1, results, step;
      step = Math.floor(this.minibeats / this.solidbeats);
      results = [];
      for (i = j = 0, ref = this.minibeats, ref1 = step; ref1 !== 0 && (ref1 > 0 ? j < ref : j > ref); i = j += ref1) {
        if ((base = this.timings)[i] == null) {
          base[i] = [];
        }
        results.push(this.timings[i].push(0));
      }
      return results;
    }

    removeMetronome() {
      var base, i, j, ref, ref1, results, step;
      step = Math.floor(this.minibeats / this.solidbeats);
      results = [];
      for (i = j = 0, ref = this.minibeats, ref1 = step; ref1 !== 0 && (ref1 > 0 ? j < ref : j > ref); i = j += ref1) {
        if ((base = this.timings)[i] == null) {
          base[i] = [];
        }
        results.push(this.timings[i] = this.timings[i].filter(function(e) {
          return e !== 0;
        }));
      }
      return results;
    }

    start() {
      this.startTime = this.ctx.currentTime;
      return this.update();
    }

    update() {
      var countPast, countSetup, i, j, ref, t, time;
      time = this.ctx.currentTime;
      console.log('update', time, this.countBinded);
      countPast = Math.ceil((time - this.startTime) / this.barDuration);
      console.log(countPast, this.barDuration);
      countSetup = this.countMustReserved - this.countBinded + countPast;
      console.log(this.countMustReserved, countSetup, this.countBinded);
      for (i = j = 0, ref = countSetup; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
        t = (this.countBinded + i) * this.barDuration;
        this.setupBarSince(t);
      }
      return this.countBinded = this.coundBinded + countSetup;
    }

    setupBarSince(time) {
      var index, j, k, len, node, ref, results, shift, v;
      ref = this.timings;
      results = [];
      for (v = j = 0, len = ref.length; j < len; v = ++j) {
        k = ref[v];
        shift = this.barDuration / this.minibeats * (+k);
        results.push((function() {
          var l, len1, results1;
          results1 = [];
          for (l = 0, len1 = v.length; l < len1; l++) {
            index = v[l];
            node = this.samples[index].createNode();
            node.connect(this.dest);
            results1.push(node.start(time + shift));
          }
          return results1;
        }).call(this));
      }
      return results;
    }

  };
})();
