import EventEmitter from './EventEmitter.js';

import Keyboard from './Keyboard.js';

import BeatMachine from './BeatMachine.js';

import Sample from './Sample.js';

import rand from './rand.js';

import BeatMachineView from './BeatMachineView.js';

import UIRoller from './UIRoller.js';

window.addEventListener('load', function() {
  var button;
  button = document.getElementById('launch');
  button.removeAttribute('disabled');
  return button.addEventListener('click', function() {
    var bm, bmv, ctx, files, i, j, kb, master, metronome, prefix, samplePicker, samples, update;
    new UIRoller(23, 1, 123, 1, 'BPM');
    button.style.display = 'none';
    kb = new Keyboard();
    kb.on('debug', function() {
      return console.log(...arguments);
    });
    kb.on('keydown', function(e) {
      e.preventDefault();
      console.log(e.charCode, e.code, e.key, e.keyCode, e.location, e.repeat);
      return console.log(performance.now());
    });
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 1;
    master.connect(ctx.destination);
    //# metronomeSound
    metronome = new Sample(ctx);
    metronome.on('error', function(e) {
      return console.log('metronome error:', e);
    });
    metronome.loadSample('./samples/metronomes/ableton-metronome.wav');
    bm = new BeatMachine({
      ctx: ctx,
      dest: master,
      metronome: metronome
    });
    bm.start();
    setInterval((function() {
      return bm.update();
    }), 1000);
    prefix = './808/dry/';
    files = `BD 808 Mid Color B 01.wav
BD 808 Sat Mid Decay B 03.wav
BD 808 Smooth C 05.wav
BD 808 Smooth C 09.wav
CH 808 Color A 04.wav
CH 808 Color A 06.wav
Clap 808 Sat B 03.wav
Cym A 808 Sat Decay B 02.wav
Maracas 808 Color 13.wav
OH 808 Sat A 02.wav
OH 808 Sat A 06.wav
Rim Shot 808 Dark 03.wav
SD 808 Classic 06.wav
SD 808 MPC60 Snap.wav
Tom Mid 808 Sat A 05.wav`.split('\n');
    samples = files.map(function(e) {
      var s;
      s = new Sample(ctx);
      s.on('error', function(e) {
        return console.log("sample doesn't loaded", e);
      });
      s.loadSample(`${prefix}${e}`);
      return s;
    });
    bm.samples = bm.samples.concat(samples);
    samplePicker = 1;
    for (i = j = 1; j <= 9; i = ++j) {
      (function(i) {
        return kb.on(`keydown.Digit${i}`, function(e) {
          console.log('sample', i);
          return samplePicker = i;
        });
      })(i);
    }
    kb.on("keydown.KeyF", function() {
      console.log(`setting sample ${samplePicker} now`);
      return bm.setSampleNow(samplePicker);
    });
    kb.on("keydown.KeyJ", function() {
      console.log(`setting sample ${samplePicker} now`);
      return bm.setSampleNow(samplePicker);
    });
    kb.on("keydown.KeyR", function() {
      console.log(`removing ${samplePicker}`);
      return bm.resetSample(samplePicker);
    });
    kb.on("keydown.KeyP", function() {
      return bm.samples[samplePicker].play(master, 0);
    });
    bmv = new BeatMachineView(bm);
    update = function() {
      bmv.update();
      return window.requestAnimationFrame(update);
    };
    return window.requestAnimationFrame(update);
  });
});
