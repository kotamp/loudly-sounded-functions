export default (function() {
  var EventEmitter;
  return EventEmitter = class EventEmitter {
    constructor() {
      this._events = {};
    }

    on(type, listener) {
      var base;
      if ((base = this._events)[type] == null) {
        base[type] = [];
      }
      return this._events[type].push(listener);
    }

    emit(type, ...args) {
      var fn, i, len, ref, results;
      if (this._events[type] != null) {
        ref = this._events[type];
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          fn = ref[i];
          results.push(fn(...args));
        }
        return results;
      }
    }

  };
})();
