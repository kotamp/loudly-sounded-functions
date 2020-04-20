(function() {
  var Debug;

  Debug = class Debug {
    constructor(options) {
      this.el = document.createElement('pre');
      this.el.style.padding = '5px';
      this.el.style.backgroundColor = '#886633';
      this.el.style.fontSize = '20px';
      document.body.appendChild(this.el);
      this.history = [];
      this.widthLimit = (options != null ? options.widthLimit : void 0) || 30;
      this.lineLimit = (options != null ? options.lineLimit : void 0) || 17;
    }

    log() {
      this.history.push(...Array.prototype.map.call(arguments, function(e) {
        return e.toString().split('\n');
      }));
      this.history = this.history.slice(-this.lineLimit);
      return this.el.innerHTML = this.history.join('\n');
    }

  };

}).call(this);
