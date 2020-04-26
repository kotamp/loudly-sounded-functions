import {
  clamp
} from './utils.js';

import drawer from './drawer.js';

export default (function() {
  var VisualAnalyser, pi05, pi2;
  pi2 = Math.PI * 2;
  pi05 = Math.PI * 0.5;
  return VisualAnalyser = class VisualAnalyser {
    constructor(ctx, src, dest) {
      this.ctx = ctx;
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 512;
      this.width = window.innerWidth - 16;
      this.height = 300;
      this.paper = Snap(this.width, this.height);
      this.path = this.paper.path("");
      this.path.attr({
        stroke: "#c800ff",
        strokeWidth: "1px"
      });
      src.connect(this.analyser);
      this.analyser.connect(dest);
      this.arr = new Float32Array(this.analyser.fftSize);
      drawer(this.draw.bind(this));
    }

    ny(y) {
      return (y + 1) * this.height / 2;
    }

    nx(x) {
      return x / this.arr.length * this.width;
    }

    draw() {
      var i, j, p, ref, ref1;
      this.analyser.getFloatTimeDomainData(this.arr);
      p = `M0,${this.ny(this.arr[0])}`;
//for i in [1...@arr.length]
      for (i = j = 0, ref = this.width, ref1 = this.arr.length / this.width / window.devicePixelRatio; ref1 !== 0 && (ref1 > 0 ? j < ref : j > ref); i = j += ref1) {
        p += "L" + i + "," + this.ny(this.arr[Math.floor(i)]);
      }
      return this.path.attr({
        d: p
      });
    }

  };
})();
