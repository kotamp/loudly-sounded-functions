(function() {
  var SliderUI;

  SliderUI = class SliderUI extends EventEmitter {
    constructor(parent, minValue, maxValue, defaultValue) {
      super();
      this.contEl = document.createElement('div');
      this.contEl.setAttribute('class', 'slider');
      this.textEl = document.createElement('div');
      this.textEl.setAttribute('class', 'text');
      this.valueEl = document.createElement('div');
      this.valueEl.setAttribute('class', 'text');
      this.rollerEl = document.createElement('svg');
      this.rollerEl.setAttribute('class', 'roller');
      this.contEl.appendChild(this.textEl);
      this.contEl.appendChild(this.valueEl);
      this.contEl.appendChild(this.rollerEl);
    }

  };

}).call(this);
