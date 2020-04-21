import EventEmitter from './EventEmitter.js';

export default (function() {
  var Sample;
  return Sample = class Sample extends EventEmitter {
    constructor(ctx) {
      super();
      if (ctx == null) {
        throw new Error('sample: ctx is not providen');
      }
      this.ctx = ctx;
      this.buffer = null;
      this.offset = void 0;
      this.duration = void 0;
      this.loop = false;
      this.loopStart = 0;
      this.loopEnd = 0;
      return this;
    }

    async loadSample(path) {
      var ab, e, res;
      try {
        res = (await fetch(path));
        ab = (await res.arrayBuffer());
        this.buffer = (await this.ctx.decodeAudioData(ab));
        return this.emit('loaded', this);
      } catch (error) {
        e = error;
        return this.emit('error', e);
      }
    }

    play(dest, _when) {
      var duration, offset, onended, src;
      if (this.buffer == null) {
        return null;
      }
      switch (arguments.length) {
        case 3:
          onended = arguments[2];
          break;
        case 4:
          offset = arguments[2];
          onended = arguments[3];
          break;
        case 5:
          offset = arguments[2];
          duration = arguments[3];
          onended = arguments[4];
      }
      console.log(dest, _when, offset, duration, onended != null);
      src = this.ctx.createBufferSource();
      src.buffer = this.buffer;
      src.loop = this.loop;
      src.loopStart = this.loopStart;
      src.loopEnd = this.loopEnd;
      src.connect(dest);
      if (onended != null) {
        src.onended = onended;
      }
      src.start(_when, offset || this.offset, duration || this.duration);
      return src;
    }

  };
})();
