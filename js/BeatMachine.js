import EventEmitter from './EventEmitter.js';

import Sample from './Sample.js';

import rand from './rand.js';

import Set from './Set.js';

import classof from './classof.js';

export default (function() {
  var BeatMachine;
  return BeatMachine = class BeatMachine extends EventEmitter {
    constructor(options) {
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
      this.bpm = options.bpm || 144;
      this.minibeats = options.minibeats || 128;
      this.solidbeats = options.solidbeats || 4;
      this.metronome = options.metronome || null;
      this.samples = [];
      this.timings = {};
      this.playing = new Set();
      this.count = {
        bound: 0,
        mustBeAhead: 1
      };
      this.startTime = 0;
      this.barDuration = 60 * 4 / this.bpm;
    }

    start() {
      console.log('start!');
      this.startTime = this.ctx.currentTime;
      console.log(this.ctx.currentTime);
      console.log(this.startTime);
      return this.update();
    }

    update() {
      var i, j, needToSetup, ref, t, time;
      console.log('updating');
      time = this.ctx.currentTime;
      this.count.played = Math.ceil((time - this.startTime) / this.barDuration);
      needToSetup = this.count.mustBeAhead - (this.count.bound - this.count.played);
/*
console.log 'bound:', @count.bound
console.log 'played: ', @count.played
console.log 'will setup', needToSetup
console.log 'duration', @barDuration
*/
      for (i = j = 0, ref = needToSetup; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
        t = (this.count.bound + i) * this.barDuration;
        console.log(this.ctx.currentTime, t);
        this.setupBarSince(t);
      }
      return this.count.bound = this.count.bound + needToSetup;
    }

    setupBarSince(time) {
      var index, k, ref, results, shift, v;
      if (this.metronome != null) {
        this.setupMetronome(time);
      }
      ref = this.timings;
      results = [];
      for (k in ref) {
        v = ref[k];
        console.log(k, v);
        shift = this.barDuration / this.minibeats * (+k);
        console.log(shift, this.barDuration, this.minibeats);
        results.push((function() {
          var j, len, ref1, results1;
          ref1 = v.get();
          results1 = [];
          for (j = 0, len = ref1.length; j < len; j++) {
            index = ref1[j];
            results1.push(this.playing.add(this.samples[index].play(this.dest, time + shift, (e) => {
              return this.playing.remove(e.target);
            })));
          }
          return results1;
        }).call(this));
      }
      return results;
    }

    setupMetronome(time) {
      var i, j, ref, ref1, results, shift, step;
      if (!(this.metronome instanceof Sample)) {
        throw new Error('beat machine: metronome sample is not an instance of Sample class. It\'s ' + classof(this.metronome));
      }
      step = Math.floor(this.minibeats / this.solidbeats);
      results = [];
      for (i = j = 0, ref = this.minibeats, ref1 = step; ref1 !== 0 && (ref1 > 0 ? j < ref : j > ref); i = j += ref1) {
        shift = this.barDuration / this.minibeats * (+i);
        results.push(this.playing.add(this.metronome.play(this.dest, time + shift, (e) => {
          return this.playing.remove(e.target);
        })));
      }
      return results;
    }

    setSampleNow(sample) {
      var base, currentTime, index, offset, startTime;
      currentTime = this.ctx.currentTime - 0.1;
      startTime = this.startTime;
      offset = (currentTime - startTime) % this.barDuration / this.barDuration;
      console.log('hello');
      console.log(currentTime);
      console.log(startTime);
      console.log(this.barDuration);
      console.log(offset);
      index = Math.floor(this.minibeats * offset);
      if ((base = this.timings)[index] == null) {
        base[index] = new Set();
      }
      return this.timings[index].add(sample);
    }

    resetSample(sample) {
      var j, k, len, ref, results;
      ref = Object.keys(this.timings);
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        k = ref[j];
        results.push(this.timings[k].remove(sample));
      }
      return results;
    }

  };
})();
