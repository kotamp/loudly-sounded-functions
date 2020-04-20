(function() {
  var init;

  window.addEventListener('load', function() {
    var button;
    button = document.getElementById('launch');
    button.removeAttribute('disabled');
    return button.addEventListener('click', function() {
      button.style.display = 'none';
      return init();
    });
  });

  init = function() {
    /*
    sampler = new Sampler
      ctx: ctx
      sample: "./samples/pack1/think--all.flac"
      loop: true
      loopStart: 0
      loopEnd: 0
      shiftTable: {}
    */
    var Qmax, Qmin, ctx, debug, freqMax, freqMin, gain, handler, kb, lowpassFilter, masterGain, modeEl, polysynth, programChangeHandler, sampler, visual, visual1;
    modeEl = document.getElementById('mode');
    programChangeHandler = function() {};
    debug = new Debug({
      lineLimit: 20
    });
    eve.on('debug', function() {
      return debug.log(...arguments);
    });
    kb = new Keyboard();
    ctx = new AudioContext();
    sampler = null;
    eve('debug', null, 'hi');
    eve.on('sampler.error', function(e) {
      return eve('debug', null, e);
    });
    eve.on('sampler.loaded', function() {
      var lastPlayedNote, lastProgram;
      eve('debug', null, 'sampler: sample is loaded');
      console.log('setup listeners');
      lastPlayedNote = null;
      lastProgram = null;
      eve.on('midi.note.on', function(note) {
        lastPlayedNote = note;
        return sampler.play(note);
      });
      eve.on('midi.note.off', function(note) {
        if (lastPlayedNote === note) {
          return lastPlayedNote = null;
        }
      });
      return eve.on('midi.program-change', function(data) {
        var prev;
        if (lastPlayedNote != null) {
          eve('debug', null, 'kb: change offset of ' + data);
          prev = sampler.shiftTable[lastPlayedNote];
          if (prev == null) {
            prev = 0;
          }
          sampler.shiftTable[lastPlayedNote] = sampler.buffer.duration / 128 * data;
          return sampler.play(lastPlayedNote);
        }
      });
    });
    masterGain = ctx.createGain();
    lowpassFilter = ctx.createBiquadFilter();
    lowpassFilter.type = "lowpass";
    gain = ctx.createGain();
    gain.gain.value = 1;
    polysynth = new Polysynth({
      ctx: ctx,
      dest: gain
    });
    visual1 = new VisualAnalyser(ctx, gain, lowpassFilter);
    lowpassFilter.connect(masterGain);
    eve.on('midi.note.on', function(note) {
      return polysynth.noteOn(note);
    });
    eve.on('midi.note.off', function(note) {
      return polysynth.noteOff(note);
    });
    visual = new VisualAnalyser(ctx, masterGain, ctx.destination);
    eve.on('keyboard.button.m', function() {
      modeEl.innerHTML = 'master';
      return programChangeHandler = function(data) {
        return masterGain.gain.cancelAndHoldAtTime(0).linearRampToValueAtTime(data / 127 * 2, ctx.currentTime + 0.01);
      };
    });
    eve.on('keyboard.button.a', function() {
      modeEl.innerHTML = 'attack';
      return programChangeHandler = function(data) {
        return polysynth.attack = data / 127 * 5;
      };
    });
    eve.on('keyboard.button.d', function() {
      modeEl.innerHTML = 'delay';
      return programChangeHandler = function(data) {
        return polysynth.delay = data / 127 * 5;
      };
    });
    eve.on('keyboard.button.s', function() {
      modeEl.innerHTML = 'sustain';
      return programChangeHandler = function(data) {
        return polysynth.sustain = data / 127 * 5;
      };
    });
    eve.on('keyboard.button.r', function() {
      modeEl.innerHTML = 'release';
      return programChangeHandler = function(data) {
        return polysynth.release = data / 127 * 5;
      };
    });
    eve.on('midi.program-change', function(data) {
      return programChangeHandler(data);
    });
    Qmin = lowpassFilter.Q.minValue;
    Qmax = lowpassFilter.Q.maxValue;
    eve.on('keyboard.button.q', function() {
      modeEl.innerHTML = 'filter Q';
      return programChangeHandler = function(data) {
        return lowpassFilter.Q.cancelAndHoldAtTime(0).linearRampToValueAtTime((Qmax - Qmin) * data / 127, 5);
      };
    });
    freqMin = lowpassFilter.frequency.minValue;
    freqMax = lowpassFilter.frequency.maxValue;
    eve.on('keyboard.button.f', function() {
      modeEl.innerHTML = 'filter frequency';
      return programChangeHandler = function(data) {
        return lowpassFilter.frequency.cancelAndHoldAtTime(0).linearRampToValueAtTime(data / 127 * (freqMax - freqMin), 5);
      };
    });
    handler = function(time) {
      eve('animation.update', null, time);
      return window.requestAnimationFrame(handler);
    };
    window.requestAnimationFrame(handler);
    window.addEventListener('keydown', function(e) {
      return eve('keyboard.keydown', this, e);
    });
    return window.addEventListener('keyup', function(e) {
      return eve('keyboard.keyup', this, e);
    });
  };

}).call(this);
