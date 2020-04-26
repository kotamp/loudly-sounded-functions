import Visualizer from './VCircle.js';

(function() {
  return window.addEventListener('load', function() {
    var b;
    b = document.getElementById('launch');
    b.removeAttribute('disabled');
    return b.addEventListener('click', function() {
      var audioEl, ctx, filePicker, mediaSrc, vi;
      b.style.display = 'none';
      filePicker = document.getElementById('myfile');
      audioEl = document.getElementById('audio');
      ctx = new AudioContext();
      filePicker.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
          return audio.setAttribute('src', URL.createObjectURL(e.target.files[0]));
        }
      });
      mediaSrc = ctx.createMediaElementSource(audioEl);
      return vi = new Visualizer(ctx, mediaSrc, ctx.destination);
    });
  });
})();
