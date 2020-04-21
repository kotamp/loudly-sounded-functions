import EventEmitter from './EventEmitter.js';

export default (function() {
  var BeatMachineView, BeatView, bg;
  bg = {
    1: "#990066",
    2: "#333366",
    3: "#333366",
    4: "#003355",
    5: "#009966",
    6: "#003300",
    7: "#669900",
    8: "#666600",
    0: "#996633"
  };
  BeatView = class BeatView extends EventEmitter {
    constructor(parent, color, isOn) {
      super();
      this.el = document.createElement('div');
      parent.appendChild(this.el);
      this.selected = isOn;
      this.color = color;
      this.el.style.color = "white";
      this.el.style.backgroundColor = this.selected ? this.color : "black";
      this.listener = (e) => {
        return this.emit("click");
      };
      this.el.addEventListener("click", this.listener);
    }

    clean() {
      this.el.removeEventListener("click", this.listener);
      return this.el.remove();
    }

    update(isOn) {
      if (isOn !== this.selected) {
        this.selected = isOn;
        return this.el.style.backgroundColor = this.selected ? this.color : "black";
      }
    }

  };
  return BeatMachineView = class BeatMachineView {
    constructor(model) {
      var beats, c, cc, i, j, r, ref, row, rr;
      this.model = model;
      this.el = document.createElement('div');
      document.body.appendChild(this.el);
      console.log(document.body);
      this.beats = [];
      this.rows = [];
      this.rr = rr = this.model.minibeats;
      this.cc = cc = 9;
      for (r = i = 0, ref = rr; (0 <= ref ? i < ref : i > ref); r = 0 <= ref ? ++i : --i) {
        beats = [];
        this.beats.push(beats);
        row = document.createElement('div');
        row.setAttribute('class', 'beat-row');
        this.rows.push(row);
        this.el.appendChild(row);
        for (c = j = 0; j < 9; c = ++j) {
          beats.push(new BeatView(row, bg[c], false));
        }
      }
      this.update();
      console.log(this.rows);
    }

    update() {
      var c, i, r, ref, results, ti;
      results = [];
      for (r = i = 0, ref = this.rr; (0 <= ref ? i < ref : i > ref); r = 0 <= ref ? ++i : --i) {
        if (this.model.timings[r] != null) {
          ti = this.model.timings[r].get();
          results.push((function() {
            var j, ref1, results1;
            results1 = [];
            for (c = j = 0, ref1 = this.cc; (0 <= ref1 ? j < ref1 : j > ref1); c = 0 <= ref1 ? ++j : --j) {
              results1.push(this.beats[r][c].update(ti.indexOf(c + 1) !== -1));
            }
            return results1;
          }).call(this));
        } else {
          results.push(void 0);
        }
      }
      return results;
    }

  };
})();
