import EventEmitter from './EventEmitter.js';

import Keyboard from './Keyboard.js';

import BeatMachine from './BeatMachine.js';

console.log('init');

window.addEventListener('load', function() {
  var button;
  button = document.getElementById('launch');
  console.log(button);
  button.removeAttribute('disabled');
  return button.addEventListener('click', function() {
    var bm, ctx, kb, master;
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
    bm = new BeatMachine({
      ctx: ctx,
      dest: master
    });
    return bm.on('loaded', function() {
      bm.setupMetronome();
      bm.start();
      return setInterval((function() {
        return bm.update();
      }), 1000);
    });
  });
});
