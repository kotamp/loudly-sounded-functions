import {
  clamp
} from './utils.js';

import drawer from './Drawer.js';

export default (function() {
  var VisualAnalyser, ln1e3, ln20;
  ln20 = Math.log(20);
  ln1e3 = 3 * Math.log(10);
  return VisualAnalyser = class VisualAnalyser {
    constructor(ctx, src, dest) {
      this.ctx = ctx;
      this.analyser = ctx.createAnalyser();
      src.connect(this.analyser);
      this.analyser.connect(dest);
      this.arr = new Uint8Array(this.analyser.frequencyBinCount);
      this.freqStep = ctx.sampleRate / 2 / this.arr.length;
      this.canvas = document.createElement('canvas');
      this.canvas.width = window.innerWidth - 16;
      this.canvas.height = 200;
      document.body.appendChild(this.canvas);
      this.cc = this.canvas.getContext('2d');
      drawer(this.draw.bind(this));
    }

    normX(x) {
      return clamp(0, this.canvas.width, this.canvas.width * (Math.log(x) - ln20) / ln1e3);
    }

    normY(y) {
      return canvas.width - y / 255 * canvas.height;
    }

    draw() {
      var i, j, len, ref, v;
      this.analyser.getByteFrequencyData(this.arr);
      this.cc.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.cc.beginPath();
      this.cc.moveTo(0, this.normY(this.arr[0]));
      ref = this.arr.slice(1);
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        v = ref[i];
        this.cc.lineTo(this.normX(i * this.freqStep), this.normY(v));
      }
      this.cc.strokeStyle = "#ffb800";
      this.cc.lineWidth = 1;
      return this.cc.stroke();
    }

  };
})();
