import {
  clamp
} from './utils.js';

import drawer from './drawer.js';

export default (function() {
  var VisualAnalyser, ln1e3, ln20;
  ln20 = Math.log(20);
  ln1e3 = 3 * Math.log(10);
  return VisualAnalyser = class VisualAnalyser {
    constructor(ctx, src, dest) {
      this.ctx = ctx;
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 32768;
      this.analyser.smoothingTimeConstant = 0.01;
      this.analyser.minDecibels = -200;
      this.analyser.maxDecibels = 0;
      this.width = window.innerWidth - 16;
      this.height = window.innerHeight;
      this.paper = Snap(this.width, this.height);
      this.path = this.paper.path("");
      this.path.attr({
        stroke: "#ffc800",
        strokeWidth: "1px"
      });
      src.connect(this.analyser);
      this.analyser.connect(dest);
      this.arr = new Uint8Array(this.analyser.frequencyBinCount);
      this.freqStep = ctx.sampleRate / 2 / this.arr.length;
      drawer(this.draw.bind(this));
    }

    normX(x) {
      return clamp(0, this.width, this.width * (Math.log(x) - ln20) / ln1e3);
    }

    normY(y) {
      return this.height - y / 255 * this.height;
    }

    draw() {
      var i, j, len, ref, str, v;
      this.analyser.getByteFrequencyData(this.arr);
      str = `M0,${this.height}`;
      ref = this.arr;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        v = ref[i];
        str += `L${this.normX(i * this.freqStep)},${this.normY(v)}`;
      }
      str += `L${this.width},${this.height}Z`;
      return this.path.attr({
        d: str
      });
    }

  };
})();
