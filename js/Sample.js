import EventEmitter from './EventEmitter.js';

export default (function() {
  var Sample;
  return Sample = class Sample extends EventEmitter {
    constructor(ctx) {
      console.log('init sample');
      super();
      if (ctx == null) {
        throw new Error('sample: ctx is not providen');
      }
      this.ctx = ctx;
      this.buffer = null;
      this.path = '';
      return this;
    }

    async loadSample() {
      var ab, e, res;
      try {
        res = (await fetch(this.path));
        ab = (await res.arrayBuffer());
        this.buffer = (await this.ctx.decodeAudioData(ab));
        return this.emit('loaded', this);
      } catch (error) {
        e = error;
        return this.emit('error', e);
      }
    }

    createNode() {
      var src;
      src = this.ctx.createBufferSource;
      src.buffer = this.buffer;
      return src;
    }

  };
})();
