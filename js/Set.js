export default (function() {
  var Set;
  return Set = class Set {
    constructor() {
      // temporary implementation. idk how to
      // search obj by reference < O(n) in js
      // because keys in js is string you can't
      // just @obj[{a1:23}] = ...
      this.arr = [];
    }

    add(...objs) {
      var j, len, o, results;
      results = [];
      for (j = 0, len = objs.length; j < len; j++) {
        o = objs[j];
        if (o != null) {
          results.push(this.arr.push(o));
        }
      }
      return results;
    }

    remove(...objs) {
      var i, j, len, narr, ref;
      narr = [];
      ref = this.arr;
      for (j = 0, len = ref.length; j < len; j++) {
        i = ref[j];
        if (objs.indexOf(i) === -1) {
          narr.push(i);
        }
      }
      return this.arr = narr;
    }

    get() {
      return this.arr;
    }

  };
})();
