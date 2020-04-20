(function() {
  var Graph;

  Graph = class Graph {
    constructor(ctx, canvas, drawer) {
      this.c = ctx;
      this.a = this.c.createAnalyser();
      this.arr = new Uint8Array(this.a.fftSize);
      this.cc = canvas.getContext('2d');
      drawer.on('draw', this.draw.bind(this));
    }

    linear(length, uint) {
      return uint / 255 * length;
    }

    draw() {
      var arr, height, i, j, ref, toX, toY, width;
      this.a.getByteTimeDomainData(this.arr);
      arr = this.arr;
      width = this.cc.canvas.width;
      height = this.cc.canvas.height;
      toX = this.linear.bind(this, width);
      toY = this.linear.bind(this, height);
      this.cc.clearRect(0, 0, width, height);
      this.cc.beginPath();
      this.cc.moveTo(toX(arr[0]), toY(arr[0]));
      for (i = j = 1, ref = arr.length; (1 <= ref ? j < ref : j > ref); i = 1 <= ref ? ++j : --j) {
        this.cc.lineTo(toX(arr[1]), toY(arr[1]));
      }
      this.cc.strokeStyle = "#338866";
      return this.cc.stroke();
    }

  };

}).call(this);
