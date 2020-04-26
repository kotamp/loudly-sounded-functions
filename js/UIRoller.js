import EventEmitter from './EventEmitter.js';

export default (function() {
  var UIRoller;
  return UIRoller = class UIRoller extends EventEmitter {
    constructor(defaultValue, min, max, step, label) {
      super();
      this.min = min;
      this.max = max;
      this.step = step;
      this.container = document.createElement('div');
      this.container.setAttribute('class', 'roller');
      document.body.appendChild(this.container);
      window.addEventListener('wheel', this.onwheel.bind(this));
      this.container.addEventListener('hover', this.onhover.bind(this));
      this.label = document.createTextNode(label);
      this.text = document.createElement('span');
      this.text.innerHTML = defaultValue.toFixed(2);
      this.container.appendChild(this.label);
      this.container.appendChild(this.text);
    }

    onwheel(e) {
      e.preventDefault();
      alert('wheel');
      return console.log(e.deltaY, e.deltaZ, e.deltaX);
    }

    onhover(e) {
      return alert('hover');
    }

  };
})();
